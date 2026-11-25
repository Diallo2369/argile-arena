// Interactions du site (navigateur) : menu, recherche d'adresse, animations, outils, page résultat
import { CATS, plaf, eur, fissuroSVG, isoDMY, isoFR, normz } from "../lib/core.js";

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const PAGE = document.body.dataset.page || "";
const GEO = "https://data.geopf.fr/geocodage";

/* ---------- Animations d'apparition ---------- */
let io;
export function observe() {
  const targets = $$(".rv:not(.vis), .ig:not(.vis), .chart:not(.vis), .card:not(.vis), .mini:not(.vis), .stat:not(.vis), .scale10:not(.vis), .expobar:not(.vis)");
  if (!("IntersectionObserver" in window) || reduce()) { targets.forEach(show); return; }
  io?.disconnect();
  io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } }), { threshold: .15 });
  targets.forEach(t => io.observe(t));
}
function show(el) {
  el.classList.add("vis");
  el.querySelectorAll(".ring").forEach(r => r.setAttribute("stroke-dashoffset", r.dataset.off));
  el.querySelectorAll("[data-count]").forEach(countUp);
  if (el.matches("[data-count]")) countUp(el);
}
function countUp(el) {
  if (el.dataset.done) return; el.dataset.done = 1;
  const to = parseFloat(el.dataset.count), d = +el.dataset.dec || 0, suf = el.dataset.suf || "", pre = el.dataset.pre || "", t0 = performance.now(), dur = 1100;
  if (reduce()) return;
  const f = v => pre + v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d }) + suf;
  const step = n => { const k = Math.min(1, (n - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = f(to * e); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
function animateDetails(root) {
  root.querySelectorAll("details.vol").forEach(det => {
    if (det.dataset.wired) return; det.dataset.wired = 1;
    const sum = det.querySelector("summary"), body = det.querySelector(".in");
    sum.addEventListener("click", e => {
      if (reduce()) return;
      e.preventDefault();
      if (det.dataset.anim) return; det.dataset.anim = 1;
      if (!det.open) {
        det.open = true; const h = body.scrollHeight;
        body.animate([{ height: "0px", opacity: 0, transform: "translateY(-6px)" }, { height: h + "px", opacity: 1, transform: "none" }], { duration: 420, easing: "cubic-bezier(.2,.7,.2,1)" }).onfinish = () => { delete det.dataset.anim; };
        det.querySelectorAll(".chart").forEach(c => { c.classList.remove("vis"); requestAnimationFrame(() => requestAnimationFrame(() => c.classList.add("vis"))); });
      } else {
        const h = body.scrollHeight;
        body.animate([{ height: h + "px", opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 300, easing: "cubic-bezier(.4,0,.6,1)" }).onfinish = () => { det.open = false; delete det.dataset.anim; };
      }
    });
  });
}
/* ---------- Bulles de définition ---------- */
function wireDefs(root) {
  root.querySelectorAll(".def").forEach(b => b.onclick = e => {
    e.stopPropagation();
    $$(".defpop").forEach(x => x.remove());
    if (b.getAttribute("aria-expanded") === "true") { b.setAttribute("aria-expanded", "false"); return; }
    $$(".def[aria-expanded=true]").forEach(x => x.setAttribute("aria-expanded", "false"));
    const pop = document.createElement("span"); pop.className = "defpop"; pop.setAttribute("role", "tooltip"); pop.textContent = b.dataset.def;
    document.body.appendChild(pop);
    const r = b.getBoundingClientRect(), w = Math.min(300, innerWidth - 24);
    pop.style.maxWidth = w + "px";
    pop.style.left = Math.max(12, Math.min(innerWidth - w - 12, r.left + scrollX)) + "px";
    pop.style.top = (r.bottom + scrollY + 8) + "px";
    b.setAttribute("aria-expanded", "true");
  });
}
document.addEventListener("click", () => { $$(".defpop").forEach(x => x.remove()); $$(".def[aria-expanded=true]").forEach(x => x.setAttribute("aria-expanded", "false")); });

/* ---------- Liens internes : défilement doux ---------- */
function wireJumps(root = document) {
  const go = id => { const t = document.getElementById(id); if (t) window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 70, behavior: reduce() ? "auto" : "smooth" }); };
  root.querySelectorAll("[data-jumpto]").forEach(a => a.onclick = e => { e.preventDefault(); go(a.dataset.jumpto); });
  root.querySelectorAll("[data-jump]").forEach(a => a.onclick = e => { e.preventDefault(); go(a.dataset.jump); });
  root.querySelectorAll("[data-scroll]").forEach(a => a.onclick = e => { e.preventDefault(); go(a.dataset.scroll); history.replaceState(null, "", "#" + a.dataset.scroll); });
  root.querySelectorAll("[data-openvol]").forEach(a => a.onclick = e => {
    e.preventDefault(); const d = document.getElementById(a.dataset.openvol); if (!d) return;
    if (!d.open) d.querySelector("summary").click();
    d.scrollIntoView({ behavior: reduce() ? "auto" : "smooth", block: "start" }); d.querySelectorAll(".rv").forEach(show);
  });
}

/* ---------- Données publiques du site (par département) ---------- */
const depCache = {};
let depsList;
export const depOf = code => code.startsWith("97") ? code.slice(0, 3) : code.slice(0, 2);
// Arrondissements de Paris, Lyon, Marseille -> commune
const commOf = code => /^751\d\d$/.test(code) ? "75056" : /^6938\d$/.test(code) ? "69123" : /^132\d\d$/.test(code) ? "13055" : code;
async function depData(dep) {
  if (!depCache[dep]) depCache[dep] = fetch(`/data/dep/${dep}.json`).then(r => r.ok ? r.json() : null).catch(() => null);
  return depCache[dep];
}
async function depInfo(dep) {
  depsList ||= fetch("/data/departements.json").then(r => r.json());
  return (await depsList).find(d => d.code === dep);
}
export async function communeData(citycode) {
  const code = commOf(citycode), dep = depOf(code), [dd, di] = await Promise.all([depData(dep), depInfo(dep)]);
  const c = dd && dd[code];
  if (!c || !di) return null;
  return { code, nom: c.n, slug: c.s, arretes: c.a, annees: c.y, rga: c.r, refus: c.f || [], dep, depNom: di.nom, depSlug: di.slug, cp: [] };
}

/* ---------- Recherche d'adresse (Géoplateforme de l'IGN) ---------- */
async function geocode(q, municipality) {
  const u = `${GEO}/search?q=${encodeURIComponent(q)}&autocomplete=1&limit=6${municipality ? "&type=municipality" : ""}`;
  const r = await fetch(u); if (!r.ok) throw new Error("géocodage");
  return (await r.json()).features.map(f => ({ label: f.properties.label, type: f.properties.type, citycode: f.properties.citycode, city: f.properties.city,
    postcode: f.properties.postcode, lon: f.geometry.coordinates[0], lat: f.geometry.coordinates[1] }));
}
const TYPE_LAB = { housenumber: "adresse", street: "rue", locality: "lieu-dit", municipality: "commune" };
function attachAC(input, list, onPick, { municipality = false } = {}) {
  let items = [], idx = -1, timer, seq = 0;
  const close = () => { list.classList.remove("open"); input.setAttribute("aria-expanded", "false"); idx = -1; };
  const paint = (msg) => {
    list.innerHTML = msg ? `<li role="option" aria-disabled="true"><span>${msg}</span></li>`
      : items.map((p, i) => `<li role="option" id="${list.id}-${i}" aria-selected="${i === idx}" data-i="${i}"><span>${p.label.replace(/</g, "&lt;")}</span><small>${TYPE_LAB[p.type] || ""}</small></li>`).join("");
    list.classList.add("open"); input.setAttribute("aria-expanded", "true");
    input.setAttribute("aria-activedescendant", idx >= 0 ? `${list.id}-${idx}` : "");
  };
  const run = () => {
    const q = input.value.trim(); clearTimeout(timer);
    if (q.length < 3) { items = []; close(); return; }
    const my = ++seq;
    timer = setTimeout(async () => {
      try { const r = await geocode(q, municipality); if (my !== seq) return; items = r; idx = items.length ? 0 : -1; paint(items.length ? "" : "Aucun résultat. Vérifiez l'orthographe."); }
      catch (_) { if (my === seq) paint("Recherche indisponible pour le moment. Réessayez dans un instant."); }
    }, 180);
  };
  input.addEventListener("input", run);
  input.addEventListener("keydown", e => {
    if (e.key === "ArrowDown") { e.preventDefault(); if (items.length) { idx = Math.min(items.length - 1, idx + 1); paint(); } }
    else if (e.key === "ArrowUp") { e.preventDefault(); idx = Math.max(0, idx - 1); if (items.length) paint(); }
    else if (e.key === "Enter") { e.preventDefault(); const p = items[idx >= 0 ? idx : 0]; if (p) { close(); onPick(p); } else run(); }
    else if (e.key === "Escape") close();
  });
  list.addEventListener("mousedown", e => { const li = e.target.closest("li[data-i]"); if (li) { e.preventDefault(); close(); onPick(items[+li.dataset.i]); } });
  input.addEventListener("blur", () => setTimeout(close, 150));
  return { first: async () => { const q = input.value.trim(); if (q.length < 3) return null; return items[0] || (await geocode(q, municipality))[0] || null; } };
}
const addrURL = p => `/adresse/?${new URLSearchParams({ q: p.label, lat: p.lat.toFixed(6), lon: p.lon.toFixed(6), code: p.citycode, cp: p.postcode || "" })}`;
async function pick(p) {
  if (p.type === "municipality") {
    const c = await communeData(p.citycode);
    if (c) { location.href = `/argile/${c.slug}/`; return; }
  }
  location.href = addrURL(p);
}

/* ---------- En-tête : menu, recherche plein écran, bouton flottant ---------- */
const ovl = $("#ovl");
function openSearch(prefill = "") {
  ovl.hidden = false; const i = $("#q2"); i.value = prefill; setTimeout(() => { i.focus(); if (prefill) i.dispatchEvent(new Event("input")); }, 30);
}
function closeSearch() { ovl.hidden = true; $("#open-search").focus(); }
$("#open-search").onclick = () => openSearch();
$("#ovl-x").onclick = closeSearch;
ovl.addEventListener("click", e => { if (e.target.id === "ovl") closeSearch(); });
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !ovl.hidden) closeSearch();
  if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
});
attachAC($("#q2"), $("#q2-list"), p => { ovl.hidden = true; pick(p); });
document.addEventListener("click", e => { const b = e.target.closest("[data-open-search]"); if (b) { e.preventDefault(); openSearch(b.dataset.prefill || ""); } });
$(".burger").onclick = () => { const n = $("#nav"); n.classList.toggle("open"); $(".burger").setAttribute("aria-expanded", n.classList.contains("open")); };

const fab = document.createElement("button"); fab.type = "button"; fab.id = "fab"; fab.setAttribute("data-open-search", "");
fab.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>Tester une adresse`;
document.body.appendChild(fab);
if (PAGE === "adresse" || PAGE === "lettres") fab.classList.add("off");
const sf = $("#searchform");
if (sf && "IntersectionObserver" in window) { fab.classList.add("off"); new IntersectionObserver(es => es.forEach(en => fab.classList.toggle("off", en.isIntersecting || en.boundingClientRect.top > 0))).observe(sf); }

/* ---------- Accueil : formulaire et position ---------- */
if (sf) {
  const ac = attachAC($("#q"), $("#q-list"), pick);
  sf.addEventListener("submit", async e => {
    e.preventDefault();
    try { const p = await ac.first(); if (p) pick(p); else $("#res").innerHTML = `<p class="note" style="margin-top:10px">Tapez au moins 3 lettres de votre adresse ou de votre commune.</p>`; }
    catch (_) { $("#res").innerHTML = `<p class="note" style="margin-top:10px">Recherche indisponible pour le moment. Réessayez dans un instant.</p>`; }
  });
  $("#geo").onclick = () => {
    const out = $("#res");
    if (!navigator.geolocation) { out.innerHTML = `<p class="note" style="margin-top:10px">Votre navigateur ne donne pas accès à la position.</p>`; return; }
    out.innerHTML = `<p class="note" style="margin-top:10px">Recherche de votre position…</p>`;
    navigator.geolocation.getCurrentPosition(async pos => {
      try {
        const { latitude: lat, longitude: lon } = pos.coords;
        const r = await fetch(`${GEO}/reverse?lon=${lon}&lat=${lat}&limit=1`).then(r => r.json());
        const f = r.features[0];
        if (!f) throw 0;
        location.href = addrURL({ label: f.properties.label, lat, lon, citycode: f.properties.citycode, postcode: f.properties.postcode });
      } catch (_) { out.innerHTML = `<p class="note" style="margin-top:10px">Adresse introuvable à cette position. Tapez-la plutôt.</p>`; }
    }, () => { out.innerHTML = `<p class="note" style="margin-top:10px">Position refusée ou indisponible. Tapez votre adresse.</p>`; }, { enableHighAccuracy: true, timeout: 10000 });
  };
}

/* ---------- Page département : filtre ---------- */
const cf = $("#cfilter");
if (cf) cf.addEventListener("input", () => { const v = normz(cf.value.trim()); $$("#clist li").forEach(li => li.hidden = v && !li.dataset.n.includes(v)); });

/* ---------- Estimateur du Fonds prévention argile ---------- */
function estimCalc() {
  const n = +$("#e-n").value, r = +String($("#e-r").value).replace(/\D/g, "");
  const k = ["tmo", "mo", "int"].find(k => r <= plaf(k, n)), o = $("#e-out");
  if (!k) { o.innerHTML = `<span class="cat" style="background:var(--muted)">Revenus supérieurs</span><p style="font-size:19px"><strong>Pas d'aide du fonds.</strong> Au-delà de ${eur(plaf("int", n))} pour ${n} personne${n > 1 ? "s" : ""}, le fonds ne finance rien.</p><p class="note" style="color:inherit">La garantie catastrophe naturelle de votre assurance reste votre recours en cas de sinistre.</p>`; return; }
  const c = CATS[k];
  o.innerHTML = `<span class="cat" style="background:${c[1]}">Ménage ${c[0].toLowerCase()}</span>
   <p>Plafond pour ${n} personne${n > 1 ? "s" : ""} : ${eur(plaf(k, n))}</p>
   <table><tr><td>Diagnostic (jusqu'à 2 000 € HT)</td><td class="n">${Math.round(c[2] * 100)} % · ${eur(2000 * c[2])}</td></tr>
   <tr><td>Maîtrise d'œuvre (jusqu'à 1 800 € HT)</td><td class="n">${Math.round(c[2] * 100)} % · ${eur(1800 * c[2])}</td></tr>
   <tr><td>Travaux (jusqu'à 14 000 € HT)</td><td class="n">${Math.round(c[3] * 100)} % · ${eur(14000 * c[3])}</td></tr></table>
   <p class="note" style="color:inherit">Montants maximaux, si les dépenses atteignent les plafonds. Estimation : seul le simulateur officiel fait foi.</p>`;
}
if ($("#est")) { $("#e-n").onchange = estimCalc; $("#e-r").oninput = estimCalc; estimCalc(); }

/* ---------- Téléchargements, rappel d'agenda ---------- */
function dl(name, mime, text, msgEl) {
  try {
    const u = URL.createObjectURL(new Blob([text], { type: mime })), a = document.createElement("a");
    a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 2000);
    if (msgEl) msgEl.textContent = `Fichier enregistré : ${name}.`;
  } catch (_) { if (msgEl) msgEl.textContent = "Téléchargement impossible sur cet appareil."; }
}
const icsEsc = t => String(t).replace(/[\\;,]/g, m => "\\" + m).replace(/\r?\n/g, "\\n");
function icsFor(commune, url) {
  const d = new Date(); d.setMonth(d.getMonth() + 3); const ymd = x => x.toISOString().slice(0, 10).replace(/-/g, "");
  const now = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Argile Arena//Rappel//FR", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
    "UID:rappel-" + Date.now() + "@argilearena.fr", "DTSTAMP:" + now, "DTSTART;VALUE=DATE:" + ymd(d), "RRULE:FREQ=MONTHLY;INTERVAL=3;COUNT=8",
    "SUMMARY:Vérifier les arrêtés sécheresse – " + icsEsc(commune),
    "DESCRIPTION:" + icsEsc("Un nouvel arrêté de catastrophe naturelle sécheresse ? Vous avez 30 jours après sa publication pour déclarer vos fissures à votre assureur. " + url),
    "URL:" + url, "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:Vérifier les arrêtés sécheresse", "TRIGGER:PT9H", "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-ics]"); if (!b) return;
  const url = location.origin + b.dataset.url;
  dl("rappel-arretes-" + normz(b.dataset.ics).replace(/[^a-z0-9]+/g, "-") + ".ics", "text/calendar", icsFor(b.dataset.ics, url), b.closest(".suivre").querySelector(".msg"));
});

/* ---------- Fissuromètre ---------- */
if ($("#fz-print")) {
  const m = $("#fz-msg");
  $("#fz-print").onclick = () => { document.body.classList.add("print-fissuro"); window.print(); setTimeout(() => document.body.classList.remove("print-fissuro"), 500); };
  $("#fz-dl").onclick = () => dl("fissurometre-argile-arena.svg", "image/svg+xml", `<?xml version="1.0" encoding="UTF-8"?>\n` + fissuroSVG().replace(' class="fissuro"', ''), m);
}

/* ---------- Sélecteur de commune (dossier 2026, lettres) ---------- */
function communePicker(input, onPick) {
  attachAC(input, document.getElementById(input.getAttribute("aria-controls")), async p => {
    input.value = p.city || p.label;
    onPick(await communeData(p.citycode), p);
  }, { municipality: true });
}
const s26 = $("#s26");
if (s26) communePicker($("#q3"), c => {
  if (!c) { s26.innerHTML = `<p class="note" style="margin-top:14px">Commune introuvable dans nos données (la carte des argiles ne couvre que la France métropolitaine).</p>`; return; }
  const a26 = c.arretes.filter(a => a[2] >= "2026-01-01"), last = c.arretes[0], r26 = (c.refus || []).find(r => r[2] >= "2026-01-01");
  s26.innerHTML = `<div class="here" style="margin-top:16px">${a26.length
    ? `<strong>${c.nom} : la sécheresse de 2026 est reconnue.</strong><span>Arrêté publié au Journal officiel le ${isoFR(a26[0][3])}, pour la période du ${isoDMY(a26[0][1])} au ${isoDMY(a26[0][2])}. Vous avez 30 jours après cette date pour déclarer vos fissures.</span>`
    : r26 ? `<strong>${c.nom} : la demande pour 2026 a été refusée.</strong><span>Arrêté publié au Journal officiel le ${isoFR(r26[3])}. La commune peut contester la décision devant le tribunal administratif.</span>`
    : `<strong>${c.nom} : pas encore d'arrêté « sécheresse » pour 2026.</strong><span>${last ? `Le dernier arrêté sécheresse de la commune a été publié au Journal officiel le ${isoFR(last[3])}.` : "Aucun arrêté sécheresse depuis 1989."}</span>`}
    <span><a href="/argile/${c.slug}/">Tout sur l'argile à ${c.nom} ›</a></span></div>`;
});

/* ---------- Modèles de lettres ---------- */
const LT = { type: new URLSearchParams(location.search).get("lettre") === "assureur" ? "assureur" : "mairie", arretes: [] };
const parseISO = t => { const [y, m, d] = t.split("-").map(Number); return new Date(y, m - 1, d); };
const fmtD = d => d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
function lettreTexte() {
  const f = $("#lform"); const v = k => (f.elements[k]?.value || "").trim(); const ph = (k, d) => v(k) || `[${d}]`;
  const tete = `${ph("nom", "Nom Prénom")}\n${ph("adr", "Adresse")}\n${ph("com", "Commune")}\n\n`;
  const date = `Le ${fmtD(new Date())}\n\n`;
  const desc = v("desc") ? ` Je constate notamment : ${v("desc")}.` : "";
  if (LT.type === "mairie") return tete + `À l'attention de Madame la Maire / Monsieur le Maire\nMairie de ${ph("com", "Commune")}\n\n` + date +
    `Objet : demande de reconnaissance de l'état de catastrophe naturelle – sécheresse ${ph("annee", "année")}\n\nMadame la Maire, Monsieur le Maire,\n\nDes fissures sont apparues ${ph("quand", "date")} sur ma maison située ${ph("adr", "adresse")}, à ${ph("com", "commune")}.${desc}\n\nCes dommages pourraient être liés aux mouvements de terrain dus à la sécheresse et à la réhydratation des sols argileux. Je vous demande de bien vouloir déposer, au nom de la commune, une demande de reconnaissance de l'état de catastrophe naturelle pour la sécheresse de ${ph("annee", "année")}.\n\nVous trouverez ci-joint des photographies datées des fissures.\n\nJe vous prie d'agréer, Madame la Maire, Monsieur le Maire, l'expression de mes salutations distinguées.\n\n${ph("nom", "Nom Prénom")}`;
  const a = LT.arretes[+v("arr")];
  const arr = a ? `L'arrêté ${a[0]}, publié au Journal officiel du ${isoDMY(a[3])}, reconnaît l'état de catastrophe naturelle pour les mouvements de terrain consécutifs à la sécheresse et à la réhydratation des sols, à ${ph("com", "commune")}, pour la période du ${isoDMY(a[1])} au ${isoDMY(a[2])}.`
    : `L'arrêté [référence], publié au Journal officiel du [date], reconnaît l'état de catastrophe naturelle pour les mouvements de terrain consécutifs à la sécheresse et à la réhydratation des sols, à ${ph("com", "commune")}.`;
  return tete + `${ph("ass", "Assureur")}\nService sinistres\n\n` + date +
    `Objet : déclaration de sinistre – catastrophe naturelle sécheresse\nContrat n° ${ph("contrat", "numéro de contrat")}\nLettre recommandée avec accusé de réception\n\nMadame, Monsieur,\n\n${arr}\n\nMa maison, située ${ph("adr", "adresse")}, présente des fissures apparues ${ph("quand", "date")}.${desc}\n\nConformément à l'article L. 125-2 du Code des assurances, je vous déclare ce sinistre et vous demande de bien vouloir mandater un expert.\n\nPièces jointes : photographies datées des fissures, relevés de largeur.\n\nJe vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n${ph("nom", "Nom Prénom")}`;
}
function lettreUpdate() {
  const p = $("#paper"); if (!p) return;
  $$(".only-mairie").forEach(e => e.hidden = LT.type !== "mairie");
  $$(".only-assureur").forEach(e => e.hidden = LT.type !== "assureur");
  $$("[data-lt]").forEach(x => x.setAttribute("aria-selected", x.dataset.lt === LT.type));
  p.textContent = lettreTexte();
  p.innerHTML = p.innerHTML.replace(/\[([^\]]+)\]/g, "<mark>[$1]</mark>");
  const dEl = $("#deadline"), a = LT.arretes[+$("#lform").elements.arr.value];
  if (dEl && LT.type === "assureur" && a) {
    const lim = parseISO(a[3]); lim.setDate(lim.getDate() + 30); const late = lim < new Date();
    dEl.innerHTML = late ? `<strong>Délai dépassé :</strong> les 30 jours ont pris fin le ${fmtD(lim)}. Déclarez quand même et parlez-en à votre assureur.` : `<strong>À envoyer avant le ${fmtD(lim)}</strong> (30 jours après la publication).`;
    dEl.className = "deadline " + (late ? "late" : "ok");
  } else if (dEl) { dEl.textContent = ""; dEl.className = "deadline"; }
}
if ($("#lform")) {
  const f = $("#lform");
  f.addEventListener("input", lettreUpdate); f.addEventListener("change", lettreUpdate);
  $$("[data-lt]").forEach(b => b.onclick = () => { LT.type = b.dataset.lt; lettreUpdate(); });
  communePicker($("#lcom"), c => {
    const sel = f.elements.arr;
    LT.arretes = c ? c.arretes : [];
    sel.innerHTML = LT.arretes.length ? LT.arretes.map((a, i) => `<option value="${i}">Sécheresse du ${isoDMY(a[1])} au ${isoDMY(a[2])} (JO du ${isoDMY(a[3])})</option>`).join("")
      : `<option value="">Aucun arrêté sécheresse pour cette commune</option>`;
    lettreUpdate();
  });
  const m = $("#l-msg");
  $("#l-copy").onclick = async () => { try { await navigator.clipboard.writeText(lettreTexte()); m.textContent = "Texte copié : collez-le dans votre traitement de texte."; } catch (_) { m.textContent = "Copie impossible ici : sélectionnez le texte de la lettre."; } };
  $("#l-dl").onclick = () => dl(LT.type === "mairie" ? "lettre-mairie-secheresse.txt" : "declaration-sinistre-secheresse.txt", "text/plain;charset=utf-8", lettreTexte(), m);
  $("#l-print").onclick = () => { document.body.classList.add("print-letter"); window.print(); setTimeout(() => document.body.classList.remove("print-letter"), 500); };
  lettreUpdate();
}
document.addEventListener("click", e => { const a = e.target.closest('a[href*="modeles-de-lettres"]'); if (a && a.dataset.ltGo === "assureur") { e.preventDefault(); location.href = a.getAttribute("href") + "?lettre=assureur"; } });

/* ---------- Page résultat ---------- */
if (PAGE === "adresse") import("./result-page.js").then(m => m.start({ observe, animateDetails, wireDefs, wireJumps, communeData, openSearch }));

/* ---------- Démarrage ---------- */
wireJumps(); observe(); animateDetails(document); wireDefs(document);
