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
      arretes: a.list, annees: a.annees });
  }
  process.stdout.write(d.code + " ");
}
console.log(`\n${out.length} communes en ${Math.round((Date.now() - t0) / 1000)} s`);

fs.writeFileSync(path.join(OUT, "communes.json"), JSON.stringify(out));
const depsOut = deps.map(d => ({ ...d, slug: slugify(d.nom) + "-" + d.code }));
fs.writeFileSync(path.join(OUT, "departements.json"), JSON.stringify(depsOut));
fs.writeFileSync(path.join(PUB, "departements.json"), JSON.stringify(depsOut));
fs.writeFileSync(path.join(OUT, "sources.json"), JSON.stringify(sources));
for (const d of deps) {
  const light = {};
  for (const c of out.filter(c => c.dep === d.code)) light[c.code] = { n: c.nom, s: c.slug, a: c.arretes, y: c.annees, r: c.rga };
  fs.writeFileSync(path.join(PUB, "dep", d.code + ".json"), JSON.stringify(light));
}
