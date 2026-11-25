// Arrêtés de catastrophe naturelle publiés au Journal officiel (données ouvertes de la DILA)
// Complète GASPAR, qui a plusieurs mois de retard, et ajoute les communes NON reconnues.
//
// Chaque arrêté « portant reconnaissance de l'état de catastrophe naturelle » a des annexes en tableau :
//   ANNEXE I  : communes reconnues      (Département, Commune, Phénomène, Début, Fin, [Nombre…], Motivations)
//   ANNEXE II : communes non reconnues  (Département, Commune, Phénomène, Début, Fin, Motivations)
import fs from "fs";
import path from "path";
import zlib from "zlib";
import { Readable } from "stream";
import tar from "tar-stream";

export const DILA = process.env.DILA_URL || "https://echanges.dila.gouv.fr/OPENDATA/JORF/";
export const SINCE = "2025-01-01";          // GASPAR couvre l'historique ; le JO prend le relais

const clean = s => s.replace(/<br\s*\/?>/g, " ").replace(/<[^>]+>/g, "").replace(/&#(\d+);/g, (m, n) => String.fromCharCode(+n))
  .replace(/&amp;/g, "&").replace(/&apos;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
const iso = dmy => { const m = /(\d{2})\/(\d{2})\/(\d{4})/.exec(dmy || ""); return m ? `${m[3]}-${m[2]}-${m[1]}` : ""; };
// Motif résumé : m = critère météorologique non satisfait, g = critère géotechnique non satisfait
export const motifCode = t => (/crit[èe]re m[ée]t[ée]orologique n'est pas satisfait/i.test(t) ? "m" : "") + (/crit[èe]re g[ée]otechnique n'est pas satisfait/i.test(t) ? "g" : "");

// Analyse un article XML : renvoie des lignes [nor, jo, reconnue(1|0), département, commune, phénomène, début, fin, motif]
export function parseArticle(xml) {
  if (!/portant reconnaissance de l(?:'|&apos;|&#39;)(?:é|&#233;)tat de catastrophe naturelle/i.test(xml)) return [];
  const T = /<TEXTE\b[^>]*>/.exec(xml); if (!T) return [];
  const attr = k => (new RegExp(`${k}="([^"]*)"`).exec(T[0]) || [])[1] || "";
  const nor = attr("nor"), jo = attr("date_publi");
  if (!nor || !jo || jo < SINCE) return [];
  const body = (/<BLOC_TEXTUEL>([\s\S]*)<\/BLOC_TEXTUEL>/.exec(xml) || [])[1] || "";
  const out = [];
  // Chaque tableau, avec le titre d'annexe qui le précède
  const re = /<table[\s\S]*?<\/table>/g; let m, last = 0, statut = null;
  while ((m = re.exec(body))) {
    const before = clean(body.slice(last, m.index)); last = re.lastIndex;
    if (/non reconnues/i.test(before)) statut = 0; else if (/reconnues/i.test(before)) statut = 1;
    if (statut === null) continue;
    const rows = m[0].split(/<tr\b[^>]*>/).slice(1);
    const head = [...rows[0].matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/g)].map(x => clean(x[1]).toLowerCase());
    const col = k => head.findIndex(h => h.startsWith(k));
    const iD = col("département"), iC = col("commune"), iP = col("phénomène"), iB = col("date de début"), iF = col("date de fin"), iM = col("motivation");
    if ([iD, iC, iP, iB, iF].some(i => i < 0)) continue;
    for (const r of rows.slice(1)) {
      const cells = [...r.matchAll(/<td\b[^>]*\/>|<td\b[^>]*>([\s\S]*?)<\/td>/g)].map(x => clean(x[1] || ""));
      if (cells.length < head.length) continue;
      out.push([nor, jo, statut, cells[iD], cells[iC], cells[iP], iso(cells[iB]), iso(cells[iF]), iM >= 0 ? motifCode(cells[iM]) : ""]);
    }
  }
  return out;
}

// Lit une archive .tar.gz du JORF en flux et renvoie les lignes des arrêtés CatNat
async function scanArchive(url) {
  const r = await fetch(url, { headers: { "User-Agent": "argilearena.fr (build)" } });
  if (!r.ok) throw new Error(r.status + " " + url);
  const ex = tar.extract(); const rows = []; let n = 0;
  ex.on("entry", (h, stream, next) => {
    if (h.type !== "file" || !/\/article\/.*\.xml$/.test(h.name)) { stream.on("end", next); stream.resume(); return; }
    const chunks = [];
    stream.on("data", c => chunks.push(c));
    stream.on("end", () => {
      n++;
      const xml = Buffer.concat(chunks).toString("utf8");
      if (xml.includes("catastrophe naturelle")) rows.push(...parseArticle(xml).filter(r => /s[ée]cheresse/i.test(r[5])));
      next();
    });
  });
  await new Promise((res, rej) => {
    Readable.fromWeb(r.body).pipe(zlib.createGunzip()).on("error", rej).pipe(ex).on("finish", res).on("error", rej);
  });
  return { rows, articles: n };
}

// Mise à jour incrémentale : état et lignes conservés dans data/raw (cache entre deux publications)
export async function updateJorf(RAW) {
  const stF = path.join(RAW, "jorf_state.json"), rowF = path.join(RAW, "jorf_catnat.json");
  const state = fs.existsSync(stF) ? JSON.parse(fs.readFileSync(stF, "utf8")) : { done: [] };
  const all = fs.existsSync(rowF) ? JSON.parse(fs.readFileSync(rowF, "utf8")) : [];
  const ix = await fetch(DILA); if (!ix.ok) throw new Error(ix.status + " " + DILA);
  const html = await ix.text();
  const files = [...new Set([...html.matchAll(/href="((?:Freemium_jorf_global_|JORF_)\d{8}-\d{6}\.tar\.gz)"/g)].map(m => m[1]))].sort((a, b) => a.match(/\d{8}-\d{6}/)[0].localeCompare(b.match(/\d{8}-\d{6}/)[0]));
  const stamp = f => f.match(/\d{8}-\d{6}/)[0];
  let todo;
  const lastDone = state.done.map(stamp).sort().at(-1);
  const oldestIncr = files.filter(f => f.startsWith("JORF_")).map(stamp)[0];
  // Premier passage, ou trou trop ancien (les mises à jour ne restent en ligne que quelques semaines) : repartir du stock
  if (!state.done.length || (oldestIncr && lastDone < oldestIncr)) {
    // Premier passage : le stock complet le plus récent, puis les mises à jour qui le suivent
    const stock = files.filter(f => f.startsWith("Freemium")).at(-1);
    if (!stock) throw new Error("stock JORF introuvable sur " + DILA);
    todo = [stock, ...files.filter(f => f.startsWith("JORF_") && stamp(f) > stamp(stock))];
  } else {
    todo = files.filter(f => f.startsWith("JORF_") && stamp(f) > lastDone);
  }
  const key = r => r.slice(0, 8).join("|");
  const seen = new Set(all.map(key));
  for (const f of todo) {
    const t0 = Date.now();
    const { rows, articles } = await scanArchive(DILA + f);
    let added = 0;
    for (const r of rows) if (!seen.has(key(r))) { seen.add(key(r)); all.push(r); added++; }
    state.done.push(f);
    console.log(`  ${f} : ${articles} articles lus, ${added} lignes CatNat ajoutées (${Math.round((Date.now() - t0) / 1000)} s)`);
    fs.writeFileSync(rowF, JSON.stringify(all)); fs.writeFileSync(stF, JSON.stringify(state));
  }
  console.log(`JORF : ${all.length} décisions « sécheresse » depuis ${SINCE} (${all.filter(r => r[2] === 1).length} reconnues, ${all.filter(r => r[2] === 0).length} refusées) ; dernier JO lu : ${all.map(r => r[1]).sort().at(-1) || "—"}`);
}
