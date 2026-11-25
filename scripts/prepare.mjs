// Étape 2 : croise communes, contours, arrêtés et carte des argiles -> data/site/
//   data/site/communes.json   : toutes les communes (pour la génération des pages)
//   data/site/dep/<code>.json : version légère par département (pour la page résultat, côté navigateur)
import fs from "fs";
import path from "path";
import { nodeReader } from "./pmtiles-node.mjs";
import { slugify } from "../src/lib/util.js";

const RAW = "data/raw", OUT = "data/site", PUB = "public/data";
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(path.join(PUB, "dep"), { recursive: true });
const rd = f => JSON.parse(fs.readFileSync(path.join(RAW, f), "utf8"));

const deps = rd("departements.json");
const communes = rd("communes.json");
const sources = rd("sources.json");
const reader = nodeReader(path.join(RAW, "argile-2026.pmtiles"));

// --- Arrêtés « sécheresse » : une ligne par arrêté (référence), périodes fusionnées
const cat = new Map();
for (const l of fs.readFileSync(path.join(RAW, "catnat_sec.csv"), "utf8").trim().split("\n").slice(1)) {
  const [c, ref, deb, fin, jo] = l.split(",");
  if (!cat.has(c)) cat.set(c, new Map());
  const m = cat.get(c), k = ref + "|" + jo, a = m.get(k);
  if (!a) m.set(k, { ref, deb, fin, jo, periodes: [[deb, fin]] });
  else { if (deb < a.deb) a.deb = deb; if (fin > a.fin) a.fin = fin; a.periodes.push([deb, fin]); }
}
// --- Journal officiel (DILA) : décisions publiées depuis 2025, reconnues ou refusées
// Les annexes donnent le nom du département et de la commune : on les rattache au code INSEE.
const nz = t => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/œ/g, "oe").replace(/æ/g, "ae").replace(/[^a-z0-9]+/g, " ").trim();
const depByName = new Map(deps.map(d => [nz(d.nom), d.code]));
const comByKey = new Map(communes.map(c => [c.dep + "|" + nz(c.nom), c.code]));
const refus = new Map();
const jorfF = path.join(RAW, "jorf_catnat.json");
let jorfOk = 0, jorfMiss = [], jorfLast = "";
if (fs.existsSync(jorfF)) for (const [ref, jo, ok, depNom, comNom, , deb, fin, motif] of JSON.parse(fs.readFileSync(jorfF, "utf8"))) {
  const dep = depByName.get(nz(depNom)); const code = dep && comByKey.get(dep + "|" + nz(comNom));
  if (!code) { jorfMiss.push(`${comNom} (${depNom})`); continue; }
  jorfOk++; if (jo > jorfLast) jorfLast = jo;
  if (ok) {
    if (!cat.has(code)) cat.set(code, new Map());
    const m = cat.get(code), k = ref + "|" + jo, a = m.get(k);
    if (!a) m.set(k, { ref, deb, fin, jo, periodes: [[deb, fin]] });
    else if (!a.periodes.some(p => p[0] === deb && p[1] === fin)) { if (deb < a.deb) a.deb = deb; if (fin > a.fin) a.fin = fin; a.periodes.push([deb, fin]); }
  } else {
    if (!refus.has(code)) refus.set(code, new Map());
    refus.get(code).set(ref + "|" + deb, [ref, deb, fin, jo, motif]);
  }
}
console.log(`JO : ${jorfOk} décisions rattachées à une commune, ${jorfMiss.length} non rattachées${jorfMiss.length ? " (ex. " + jorfMiss.slice(0, 8).join(", ") + ")" : ""} ; dernier JO : ${jorfLast || "—"}`);
// Un refus suivi d'une reconnaissance pour la même période (recours) n'est plus affiché
function refusDe(code) {
  const m = refus.get(code); if (!m) return [];
  const rec = cat.get(code) ? [...cat.get(code).values()] : [];
  return [...m.values()].filter(r => !rec.some(a => a.periodes.some(p => p[0] <= r[2] && p[1] >= r[1]) && a.jo > r[3])).sort((a, b) => b[3].localeCompare(a[3]));
}

function arretes(code) {
  const m = cat.get(code); if (!m) return { list: [], annees: [] };
  const list = [...m.values()].sort((a, b) => b.jo.localeCompare(a.jo));
  const yrs = new Set();
  for (const a of list) for (const [d, f] of a.periodes) for (let y = +d.slice(0, 4); y <= +f.slice(0, 4); y++) yrs.add(y);
  return { list: list.map(a => [a.ref, a.deb, a.fin, a.jo]), annees: [...yrs].sort() };
}

// --- Part du territoire communal dans chaque niveau d'exposition (grille régulière, remplissage par lignes)
// Pour chaque ligne de la grille, on calcule les croisements avec le contour (règle pair-impair) : coût en lignes × sommets.
function rowSpans(polys, y) {
  const xs = [];
  for (const p of polys) for (const r of p) for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const a = r[i], b = r[j];
    if ((a[1] > y) !== (b[1] > y)) xs.push((b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]);
  }
  return xs.sort((u, v) => u - v);
}
async function exposition(geom) {
  const polys = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of polys) for (const [x, y] of p[0]) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  const k = Math.cos((y0 + y1) / 2 * Math.PI / 180);
  const wM = (x1 - x0) * 111320 * k, hM = (y1 - y0) * 110540;
  const step = Math.max(40, Math.sqrt(wM * hM / 900));          // ~900 points dans la boîte, ~400-600 dans la commune
  const dx = step / (111320 * k), dy = step / 110540;
  const n = [0, 0, 0, 0];
  for (let y = y0 + dy / 2; y < y1; y += dy) {
    const xs = rowSpans(polys, y);
    for (let s = 0; s + 1 < xs.length; s += 2) {
      const a = xs[s], b = xs[s + 1];
      for (let x = x0 + dx / 2 + Math.ceil((a - x0 - dx / 2) / dx) * dx; x <= b; x += dx) n[await reader.level(y, x)]++;
    }
  }
  const t = n[0] + n[1] + n[2] + n[3];
  return t ? n.map(v => Math.round(v / t * 1000) / 10) : null;
}

const t0 = Date.now(); const out = [];
const usedSlugs = new Set();
for (const d of deps) {
  const geo = JSON.parse(fs.readFileSync(path.join(RAW, "contours", d.code + ".geojson"), "utf8"));
  const contour = new Map(geo.features.map(f => [f.properties.code, f.geometry]));
  for (const c of communes.filter(c => c.dep === d.code)) {
    const g = contour.get(c.code);
    const rga = g ? await exposition(g) : null;
    const centre = c.lat ? await reader.level(c.lat, c.lon) : 0;
    const a = arretes(c.code);
    let slug = slugify(c.nom) + "-" + c.code; usedSlugs.add(slug);
    out.push({ code: c.code, nom: c.nom, dep: c.dep, slug, cp: [...new Set(c.cp)].sort(), lat: c.lat, lon: c.lon, pop: c.pop,
      rga: rga || [centre === 0 ? 100 : 0, centre === 1 ? 100 : 0, centre === 2 ? 100 : 0, centre === 3 ? 100 : 0], centre,
      arretes: a.list, annees: a.annees, refus: refusDe(c.code) });
  }
  process.stdout.write(d.code + " ");
}
console.log(`\n${out.length} communes en ${Math.round((Date.now() - t0) / 1000)} s`);

fs.writeFileSync(path.join(OUT, "communes.json"), JSON.stringify(out));
const depsOut = deps.map(d => ({ ...d, slug: slugify(d.nom) + "-" + d.code }));
fs.writeFileSync(path.join(OUT, "departements.json"), JSON.stringify(depsOut));
fs.writeFileSync(path.join(PUB, "departements.json"), JSON.stringify(depsOut));
fs.writeFileSync(path.join(OUT, "sources.json"), JSON.stringify({ ...sources, jorf: jorfLast }));
for (const d of deps) {
  const light = {};
  for (const c of out.filter(c => c.dep === d.code)) light[c.code] = { n: c.nom, s: c.slug, a: c.arretes, y: c.annees, r: c.rga, f: c.refus };
  fs.writeFileSync(path.join(PUB, "dep", d.code + ".json"), JSON.stringify(light));
}
