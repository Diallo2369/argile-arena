// Page « adresse » : lecture de la carte des argiles au point, calcul de l'indice, carte, questions
import { PMTiles } from "pmtiles";
import { makeReader } from "../lib/rga.js";
import { pageResultat, scoreFor, whyText, actionsHTML, wizardHTML, state } from "../lib/result.js";
import { NIV, NIVCOL, NIVPHRASE, niveau, dec, fixLinks, esc } from "../lib/core.js";
import { typo } from "../lib/typo.js";

export const PMTILES_URL = "https://static.data.gouv.fr/resources/carte-des-risques-retrait-gonflement-des-argiles-2026/20260401-081931/argile-2026.pmtiles";
const $ = s => document.querySelector(s);
const render = html => typo(fixLinks(html));

let pm;
async function levelAt(lat, lon) {
  pm ||= new PMTiles(PMTILES_URL);
  const reader = makeReader(async (z, x, y) => {
    const t = await pm.getZxy(z, x, y); return t ? new Uint8Array(t.data) : null;   // pmtiles décompresse déjà
  });
  return reader.level(lat, lon);
}
function fail(msg) {
  $("#r-wait").innerHTML = msg + ` <button class="btn btn-main btn-sm" type="button" data-open-search style="margin-left:8px">Chercher une autre adresse</button>`;
}

export async function start(ui) {
  const P = new URLSearchParams(location.search);
  const lat = parseFloat(P.get("lat")), lon = parseFloat(P.get("lon")), code = P.get("code") || "", label = P.get("q") || "Votre adresse";
  if (!isFinite(lat) || !isFinite(lon) || !code) { fail("Aucune adresse indiquée."); return; }
  if (code.startsWith("97")) { fail("Cette adresse est en outre-mer : la carte officielle des argiles ne couvre que la France métropolitaine."); return; }
  let c, level;
  try {
    [c, level] = await Promise.all([ui.communeData(code), levelAt(lat, lon)]);
  } catch (e) { fail("Impossible de lire la carte des argiles pour le moment. Réessayez dans un instant."); return; }
  if (!c) { fail("Commune introuvable dans nos données."); return; }
  c.cp = [P.get("cp") || ""];
  document.title = `Risque de fissure : ${label} | Argile Arena`;
  $("#result").innerHTML = render(pageResultat({ label, lat, lon, level, c }));
  const root = $("#result");
  ui.observe(); ui.animateDetails(root); ui.wireDefs(root); ui.wireJumps(root);
  wireWizard(); wireShare(ui); setupSbar(); initMap(lat, lon);
}

/* ---------- Jauge et questions ---------- */
function setGauge(svg, from, to) {
  if (!svg) return;
  const arc = svg.querySelector(".arc"), t = svg.querySelector(".gv");
  arc.setAttribute("stroke-dashoffset", 100 - to * 10); arc.setAttribute("stroke", NIVCOL[niveau(to)]);
  svg.setAttribute("aria-label", `Indice ${dec(to)} sur 10`);
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { t.textContent = dec(to); return; }
  const t0 = performance.now(), d = 900;
  const step = now => { const k = Math.min(1, (now - t0) / d), e = 1 - Math.pow(1 - k, 3); t.textContent = dec(Math.round((from + (to - from) * e) * 10) / 10); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
function updateScore(prev) {
  const s = scoreFor(), lv = niveau(s.total);
  setGauge($("#g-top"), prev, s.total); setGauge($("#g-side"), prev, s.total);
  ["#lvl-top", "#lvl-side"].forEach(sel => { const e = $(sel); e.className = "lvl lvl" + lv; e.textContent = NIV[lv]; });
  $("#phr-top").textContent = NIVPHRASE[lv];
  $("#why-top").innerHTML = typo(whyText(state.r, s, lv)); paintSbar();
  $(".mix .mb").style.width = (s.maison * 10) + "%"; $(".mix .mv").textContent = dec(s.maison);
  const n = Object.values(state.answers).filter(v => v !== null).length;
  $("#tile-m").textContent = n ? `${n} réponse${n > 1 ? "s" : ""} sur 3` : "À compléter";
  const d = $("#delta"), diff = Math.round((s.total - prev) * 100) / 100;
  d.textContent = (diff >= 0 ? "+ " : "− ") + dec(Math.abs(diff)) + " pt"; d.style.color = diff > 0 ? "var(--r3)" : "var(--r0)";
  d.classList.remove("show"); void d.offsetWidth; d.classList.add("show");
  $("#actions").innerHTML = render(actionsHTML());
  $("#actions").querySelectorAll(".rv").forEach(el => el.classList.add("vis"));
}
function wireWizard() {
  const wz = $("#wz"); if (!wz) return;
  wz.onclick = e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.k) { const prev = scoreFor().total; state.answers[b.dataset.k] = b.dataset.v; state.qStep++; wz.innerHTML = typo(wizardHTML()); updateScore(prev); }
    else if ("back" in b.dataset) { state.qStep = Math.max(0, state.qStep - 1); wz.innerHTML = typo(wizardHTML()); }
    else if ("skip" in b.dataset) { state.qStep++; wz.innerHTML = typo(wizardHTML()); }
    else if ("restart" in b.dataset) { state.qStep = 0; wz.innerHTML = typo(wizardHTML()); }
  };
}
/* ---------- Partage ---------- */
function wireShare(ui) {
  const sh = $("#share"); if (!sh) return;
  sh.onclick = async e => {
    const b = e.target.closest("button"); if (!b) return; const m = sh.querySelector(".msg");
    if (b.dataset.act === "copy") { try { await navigator.clipboard.writeText(location.href); m.textContent = "Lien copié."; } catch (_) { m.textContent = "Copiez l'adresse de la page dans votre navigateur."; } }
    if (b.dataset.act === "print") window.print();
    if (b.dataset.act === "other") ui.openSearch();
  };
}
/* ---------- Barre de score fixe ---------- */
function paintSbar() { const s = scoreFor(), lv = niveau(s.total); $("#sb-n").textContent = dec(s.total); const l = $("#sb-l"); l.className = "lvl lvl" + lv; l.textContent = NIV[lv]; }
function setupSbar() {
  const bar = $("#sbar"), v = $(".verdict"); if (!v || !("IntersectionObserver" in window)) return;
  new IntersectionObserver(([e]) => { bar.classList.toggle("show", !e.isIntersecting && e.boundingClientRect.top < 0); bar.setAttribute("aria-hidden", e.isIntersecting ? "true" : "false"); }).observe(v);
  paintSbar();
}
/* ---------- Carte : fond IGN + carte des argiles ---------- */
async function initMap(lat, lon) {
  const el = $("#map"); if (!el) return;
  try {
    const [ml, { Protocol }, wk] = await Promise.all([import("maplibre-gl"), import("pmtiles"), import("maplibre-gl/dist/maplibre-gl-worker.mjs?url"), import("maplibre-gl/dist/maplibre-gl.css")]);
    const maplibregl = ml.default || ml;
    maplibregl.setWorkerUrl(wk.default);
    const protocol = new Protocol(); maplibregl.addProtocol("pmtiles", protocol.tile);
    const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
    const map = new maplibregl.Map({
      container: el, center: [lon, lat], zoom: 14, minZoom: 6, maxZoom: 17, attributionControl: { compact: true }, cooperativeGestures: true,
      style: { version: 8, sources: {
        plan: { type: "raster", tileSize: 256, attribution: "© IGN Géoplateforme",
          tiles: ["https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&TILEMATRIXSET=PM&FORMAT=image/png&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"] },
        rga: { type: "vector", url: "pmtiles://" + PMTILES_URL, attribution: "Carte d'exposition 2026 : BRGM, data.gouv.fr" } },
        layers: [
          { id: "plan", type: "raster", source: "plan" },
          { id: "rga", type: "fill", source: "rga", "source-layer": "rga", paint: { "fill-opacity": 0.45,
            "fill-color": ["match", ["get", "ALEA"], "Fort", css("--r3") || "#c0392b", "Moyen", css("--r2") || "#e0742a", "Faible", css("--r1") || "#d9a521", "#999"] } }
        ] }
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    const pin = document.createElement("div"); pin.className = "pin"; pin.setAttribute("aria-hidden", "true");
    new maplibregl.Marker({ element: pin }).setLngLat([lon, lat]).addTo(map);
  } catch (e) { console.warn("carte", e); el.innerHTML = `<p class="note" style="padding:16px">Carte indisponible pour le moment.</p>`; }
}
