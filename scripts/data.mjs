// Étape 1 : récupère les données publiques brutes dans data/raw/
//   node scripts/data.mjs              -> téléchargement (GitHub Actions)
//   node scripts/data.mjs --fixtures   -> jeu de test local à partir de fichiers déjà présents
import fs from "fs";
import path from "path";
import { unzipSync, strFromU8 } from "fflate";

const RAW = "data/raw";
fs.mkdirSync(path.join(RAW, "contours"), { recursive: true });

export const SOURCES = {
  geoApi: "https://geo.api.gouv.fr",
  gaspar: "https://files.georisques.fr/GASPAR/gaspar.zip",
  // Carte d'exposition 2026 au format PMTiles, publiée par la DINUM sur data.gouv.fr (Licence Ouverte 2.0)
  pmtiles: "https://static.data.gouv.fr/resources/carte-des-risques-retrait-gonflement-des-argiles-2026/20260401-081931/argile-2026.pmtiles"
};

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function get(url, type = "json", tries = 6) {
  for (let i = 1; ; i++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": "argilearena.fr (build)" } });
      if (!r.ok) throw new Error(r.status + " " + url);
      return type === "json" ? await r.json() : new Uint8Array(await r.arrayBuffer());
    } catch (e) {
      if (i >= tries) throw e;
      console.warn("  nouvel essai", i, e.message); await sleep(5000 * i * i);   // 5 s, 20 s, 45 s, 80 s, 125 s
    }
  }
}
const write = (f, d) => fs.writeFileSync(path.join(RAW, f), typeof d === "string" ? d : JSON.stringify(d));
const isMetro = code => !code.startsWith("97");

// Ne garde que les arrêtés « sécheresse » (code SEC) : commune,référence,début,fin,publication JO
function gasparToCsv(text) {
  const lines = text.split(/\r?\n/); const head = lines[0].split(";");
  const ix = k => head.indexOf(k);
  const iC = ix("code_commune"), iN = ix("id_gaspar"), iR = ix("num_risque_jo"), iL = ix("lib_risque_jo"),
        iD = ix("date_debut"), iF = ix("date_fin"), iJ = ix("date_publication_jo");
  if ([iC, iN, iR, iD, iF, iJ].some(i => i < 0)) throw new Error("Format GASPAR inattendu : " + lines[0]);
  const out = ["commune,ref,debut,fin,jo"];
  for (const l of lines.slice(1)) {
    const c = l.split(";"); if (c.length < head.length) continue;
    if (c[iR] !== "SEC" && !/s[ée]cheresse/i.test(c[iL] || "")) continue;
    out.push([c[iC], c[iN], c[iD].slice(0, 10), c[iF].slice(0, 10), c[iJ].slice(0, 10)].join(","));
  }
  return out.join("\n");
}

// Si un service est indisponible, on garde les fichiers de la publication précédente (cache GitHub Actions)
const have = f => fs.existsSync(path.join(RAW, f));
async function step(name, files, fn) {
  try { await fn(); }
  catch (e) {
    if (files.every(have)) console.warn(`::warning::${name} indisponible (${e.message}) : données de la publication précédente conservées.`);
    else throw e;
  }
}

async function online() {
  await step("Découpage administratif (geo.api.gouv.fr)", ["departements.json", "communes.json"], communesStep);
  await step("Arrêtés GASPAR (files.georisques.fr)", ["catnat_sec.csv", "sources.json"], gasparStep);
  if (!have("argile-2026.pmtiles")) {
    console.log("Carte des argiles (PMTiles, ~120 Mo)…");
    fs.writeFileSync(path.join(RAW, "argile-2026.pmtiles"), await get(SOURCES.pmtiles, "bin"));
  }
}

async function communesStep() {
  console.log("Départements…");
  const deps = (await get(`${SOURCES.geoApi}/departements?fields=nom,code`)).filter(d => isMetro(d.code));

  console.log("Communes et contours…");
  const communes = [];
  for (const d of deps) {
    const list = await get(`${SOURCES.geoApi}/departements/${d.code}/communes?fields=nom,code,codesPostaux,centre,population&format=json`);
    for (const c of list) communes.push({ code: c.code, nom: c.nom, dep: d.code, cp: c.codesPostaux || [],
      lat: c.centre?.coordinates[1], lon: c.centre?.coordinates[0], pop: c.population || 0 });
    const geo = await get(`${SOURCES.geoApi}/departements/${d.code}/communes?fields=code&format=geojson&geometry=contour`);
    write(`contours/${d.code}.geojson`, geo);
    process.stdout.write(d.code + " ");
  }
  console.log(); write("communes.json", communes);
  write("departements.json", deps.map(d => ({ code: d.code, nom: d.nom })));
  console.log("OK :", communes.length, "communes");
}

async function gasparStep() {
  console.log("Arrêtés de catastrophe naturelle (GASPAR)…");
  const zip = unzipSync(await get(SOURCES.gaspar, "bin"));
  const name = Object.keys(zip).find(n => n.startsWith("catnat"));
  if (!name) throw new Error("catnat introuvable dans gaspar.zip");
  write("catnat_sec.csv", gasparToCsv(strFromU8(zip[name])));
  write("sources.json", { gaspar: name, date: new Date().toISOString().slice(0, 10) });
}

// Jeu de test : fichiers de data.gouv.fr déjà téléchargés, contours approchés par des cercles
function fixtures() {
  const SRC = process.env.FIXTURES || "/home/claude/data_raw";
  const csv = t => t.trim().split(/\r?\n/).map(l => l.split(","));
  const pad = c => c.length === 4 ? "0" + c : c;
  const only = (process.env.DEPS || "31,32,81,82,75,59").split(",");
  const deps = csv(fs.readFileSync(`${SRC}/deps.csv`, "utf8")).slice(1)
    .map(r => ({ code: r[0].padStart(2, "0"), nom: r[1] })).filter(d => only.includes(d.code));
  write("departements.json", deps);
  const seen = new Set(), communes = [];
  for (const r of csv(fs.readFileSync(`${SRC}/communes.csv`, "utf8")).slice(1)) {
    const code = pad(r[0]), dep = r[11].padStart(2, "0");
    if (!only.includes(dep)) continue;
    if (seen.has(code)) { communes.find(c => c.code === code).cp.push(r[2].padStart(5, "0")); continue; }
    seen.add(code);
    communes.push({ code, nom: r[10] || r[9], dep, cp: [r[2].padStart(5, "0")], lat: +r[5], lon: +r[6], pop: code === "31555" ? 504078 : 1000 });
  }
  write("communes.json", communes);
  for (const d of deps) {
    const feats = communes.filter(c => c.dep === d.code && c.lat).map(c => {
      const R = c.code === "31555" ? 0.05 : 0.02, ring = [];
      for (let i = 0; i <= 24; i++) { const a = i / 24 * 2 * Math.PI; ring.push([c.lon + R * 1.4 * Math.cos(a), c.lat + R * Math.sin(a)]); }
      return { type: "Feature", properties: { code: c.code }, geometry: { type: "Polygon", coordinates: [ring] } };
    });
    write(`contours/${d.code}.geojson`, { type: "FeatureCollection", features: feats });
  }
  // Arrêtés : catnat.csv (data.gouv) pour les départements de test ; Toulouse : lignes GASPAR réelles
  const out = ["commune,ref,debut,fin,jo"];
  for (const l of fs.readFileSync(`${SRC}/catnat.csv`, "utf8").split(/\r?\n/)) {
    const c = l.split(";"); if (c[12] !== "Sécheresse" || !only.includes(c[5]) || c[1] === "31555") continue;
    out.push([c[1], "TEST" + c[15].slice(0, 10).replace(/-/g, ""), c[13].slice(0, 10), c[14].slice(0, 10), c[15].slice(0, 10)].join(","));
  }
  out.push(...fs.readFileSync("scripts/fixtures/toulouse-gaspar.csv", "utf8").trim().split("\n"));
  write("catnat_sec.csv", out.join("\n"));
  write("sources.json", { gaspar: "fixtures", date: new Date().toISOString().slice(0, 10) });
  if (!fs.existsSync(path.join(RAW, "argile-2026.pmtiles"))) fs.symlinkSync(`${SRC}/argile-2026.pmtiles`, path.join(RAW, "argile-2026.pmtiles"));
  console.log("Jeu de test :", deps.length, "départements,", communes.length, "communes");
}

if (process.argv.includes("--fixtures")) fixtures(); else await online();
