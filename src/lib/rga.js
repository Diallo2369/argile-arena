// Lecture de la carte officielle d'exposition au retrait-gonflement des argiles (2026)
// à partir du fichier PMTiles publié sur data.gouv.fr (couche « rga », attribut ALEA).
// Partagé entre le calcul des statistiques (Node) et la page résultat (navigateur).
import { VectorTile } from "@mapbox/vector-tile";
import { PbfReader as Pbf } from "pbf";

export const ALEA_CODE = { Faible: 1, Moyen: 2, Fort: 3 };
export const Z = 12;

export function tileOf(lat, lon, z = Z) {
  const n = 2 ** z, r = lat * Math.PI / 180;
  const fx = (lon + 180) / 360 * n;
  const fy = (1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * n;
  return { x: Math.floor(fx), y: Math.floor(fy), fx, fy };
}

// Décode une tuile : liste de polygones { code, bbox, rings } en coordonnées de tuile
export function decodeTile(bytes) {
  const vt = new VectorTile(new Pbf(bytes));
  const L = vt.layers.rga; const out = [];
  if (!L) return out;
  for (let i = 0; i < L.length; i++) {
    const f = L.feature(i); const code = ALEA_CODE[f.properties.ALEA] || 0;
    if (!code) continue;
    const rings = f.loadGeometry();
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const ring of rings) for (const p of ring) { if (p.x < x0) x0 = p.x; if (p.y < y0) y0 = p.y; if (p.x > x1) x1 = p.x; if (p.y > y1) y1 = p.y; }
    out.push({ code, bbox: [x0, y0, x1, y1], rings, extent: L.extent });
  }
  return out;
}

// Pair-impair sur l'ensemble des anneaux (gère trous et multipolygones d'une même entité)
function inside(px, py, rings) {
  let c = false;
  for (const ring of rings) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const a = ring[i], b = ring[j];
      if ((a.y > py) !== (b.y > py) && px < (b.x - a.x) * (py - a.y) / (b.y - a.y) + a.x) c = !c;
    }
  }
  return c;
}

// Niveau d'exposition (0 à 3) d'un point, à partir des polygones décodés de sa tuile
export function levelIn(polys, fx, fy, x, y) {
  let best = 0;
  for (const p of polys) {
    const px = (fx - x) * p.extent, py = (fy - y) * p.extent;
    const b = p.bbox;
    if (px < b[0] || px > b[2] || py < b[1] || py > b[3]) continue;
    if (inside(px, py, p.rings) && p.code > best) best = p.code;
  }
  return best;
}

// Lecteur avec cache : getBytes(z,x,y) -> Uint8Array décompressée (ou null)
export function makeReader(getBytes, max = 3000) {
  const cache = new Map();
  async function polysFor(x, y) {
    const k = x + "/" + y;
    if (cache.has(k)) { const v = cache.get(k); cache.delete(k); cache.set(k, v); return v; }
    const bytes = await getBytes(Z, x, y);
    const v = bytes ? decodeTile(bytes) : [];
    cache.set(k, v); if (cache.size > max) cache.delete(cache.keys().next().value);
    return v;
  }
  return {
    async level(lat, lon) {
      const t = tileOf(lat, lon);
      return levelIn(await polysFor(t.x, t.y), t.fx, t.fy, t.x, t.y);
    }
  };
}
