// Chargement des données à la construction (Node uniquement)
import fs from "node:fs";
import path from "node:path";
import { META, isoFR } from "./core.js";

const read = f => JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/site", f), "utf8"));
let cache;
export function data() {
  if (cache) return cache;
  const communes = read("communes.json");
  const deps = read("departements.json");
  const sources = read("sources.json");
  META.date = sources.date; META.dateFR = isoFR(sources.date);
  const depBy = Object.fromEntries(deps.map(d => [d.code, d]));
  const byDep = {};
  for (const c of communes) (byDep[c.dep] ||= []).push(c);
  // 8 communes les plus proches (même département ou voisins), grille de 0,2°
  const grid = new Map(), key = (la, lo) => Math.floor(la / 0.2) + ":" + Math.floor(lo / 0.2);
  for (const c of communes) if (c.lat) { const k = key(c.lat, c.lon); if (!grid.has(k)) grid.set(k, []); grid.get(k).push(c); }
  const voisins = c => {
    if (!c.lat) return [];
    const gy = Math.floor(c.lat / 0.2), gx = Math.floor(c.lon / 0.2), cand = [];
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) cand.push(...(grid.get((gy + dy) + ":" + (gx + dx)) || []));
    const k = Math.cos(c.lat * Math.PI / 180);
    return cand.filter(o => o !== c).map(o => [o, (o.lat - c.lat) ** 2 + ((o.lon - c.lon) * k) ** 2]).sort((a, b) => a[1] - b[1]).slice(0, 8).map(x => ({ nom: x[0].nom, slug: x[0].slug }));
  };
  const CITY_CODES = ["31555", "33063", "45234", "37261", "72181", "44109", "59350", "34172", "47001", "36044"];
  const byCode = new Map(communes.map(c => [c.code, c]));
  let cities = CITY_CODES.map(k => byCode.get(k)).filter(Boolean);
  if (cities.length < 6) cities = communes.slice().sort((a, b) => b.pop - a.pop).slice(0, 10);
  cities = cities.map(c => ({ ...c, depNom: depBy[c.dep]?.nom || "" }));
  cache = { communes, deps, depBy, byDep, byCode, voisins, cities, sources };
  return cache;
}
