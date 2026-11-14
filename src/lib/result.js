// Page résultat d'une adresse : rendue dans le navigateur à partir de la carte, des arrêtés et des réponses
import { SOL_PTS, ptsSecheresse, niveau, NIV, NIVCOURT, NIVCOL, NIVPHRASE, QUESTIONS, EXPO, PILOTES, PLAN, ico, gauge, mixBar, def, DEFS, vol, pmIcon, shareRow, fondsExplainer, dec,
  chartAnnees, arretesTable, suivreHTML, aCommune, leDep, esc, has2026, isoFR, isoDMY } from "./core.js";

export const state = { answers: { arbre: null, eau: null, annee: null }, qStep: 0, r: null };

export function scoreFor(r = state.r) {
  const sol = SOL_PTS[r.level], sec = ptsSecheresse(r.c.arretes.length);
  const maison = QUESTIONS.reduce((s, Q) => { const o = Q.opts.find(o => o[0] === state.answers[Q.k]); return s + (o ? o[2] : 0); }, 0);
  return { sol, sec, maison, total: Math.round((sol + sec + maison) * 100) / 100 };
}
export function whyText(r, s, lv) {
  const sol = ["non exposé", "faible", "moyen", "fort"][r.level];
  const parts = [`le sol est classé ${sol}`];
  const n = r.c.arretes.length;
  if (s.sec >= 1) parts.push(`la sécheresse a été reconnue ${n} fois ${aCommune(esc(r.c.nom))}`);
  else if (n) parts.push(`la sécheresse a été reconnue ${n === 1 ? "une fois" : n + " fois"} ${aCommune(esc(r.c.nom))}`);
  if (state.answers.arbre === "oui") parts.push("un grand arbre est proche");
  if (state.answers.eau === "oui") parts.push("l'eau de pluie s'écoule au pied des murs");
  if (state.answers.annee === "avant") parts.push("la maison date d'avant 2021");
  const list = parts.length > 1 ? parts.slice(0, -1).join(", ") + " et " + parts.at(-1) : parts[0];
  return `<strong>Pourquoi « ${NIVCOURT[lv].toLowerCase()} » ?</strong> Parce que ${list}.`;
}
export function actionsHTML() {
  const lv = niveau(scoreFor().total);
  return PLAN.map((g, gi) => {
    const active = g.lv <= lv;
    return `<div class="pgroup ${active ? "on" : "off"} rv" style="transition-delay:${gi * .08}s">
      <div class="phead"><span class="pdot" style="background:${active ? NIVCOL[g.lv] : "var(--line)"}"></span><h3>${g.titre}</h3>${g.lv === lv ? `<span class="here-tag">Votre niveau</span>` : ""}</div>
      ${active ? `<div class="actions">${g.items.map(a => `<div class="action"><div class="ico">${ico[a.i]}</div><div><h3>${a.t}${a.k && state.answers[a.k] === "oui" ? `<span class="prio">Pour vous</span>` : ""}</h3><p>${a.d}</p></div></div>`).join("")}</div>`
        : `<p class="note">${g.items.map(a => a.t).join(" · ")}</p>`}
    </div>`;
  }).join("");
}
export function wizardHTML() {
  const { answers, qStep } = state;
  const prog = `<div class="progress" aria-hidden="true">${QUESTIONS.map(Q => `<span class="${answers[Q.k] !== null ? "done" : ""}"></span>`).join("")}</div>`;
  if (qStep >= QUESTIONS.length) {
    return `${prog}<div class="qpane"><p class="wz-step">Terminé</p><p class="wz-q">Merci, votre indice est à jour.</p>
      <div class="recap">${QUESTIONS.map(Q => { const o = Q.opts.find(o => o[0] === answers[Q.k]); return `<div><span>${Q.q}</span><b>${o ? o[1] : "—"}</b></div>`; }).join("")}</div>
      <button class="linkbtn" type="button" data-restart>Modifier mes réponses</button></div>`;
  }
  const Q = QUESTIONS[qStep];
  return `${prog}<div class="qpane">
    <p class="wz-step">Question ${qStep + 1} sur ${QUESTIONS.length}</p>
    <p class="wz-q" id="wzq">${Q.q}</p>
    <p class="wz-help">${Q.help}</p>
    <div class="opts" role="group" aria-labelledby="wzq">${Q.opts.map(o => `<button type="button" class="opt" data-k="${Q.k}" data-v="${o[0]}" aria-pressed="${answers[Q.k] === o[0]}"><span>${o[1]}</span><span class="eff">${o[2] ? `+ ${dec(o[2])} pt` : "+ 0 pt"}</span></button>`).join("")}</div>
    <div class="wz-nav">${qStep > 0 ? `<button class="linkbtn" type="button" data-back>‹ Question précédente</button>` : "<span></span>"}<button class="linkbtn" type="button" data-skip>Je ne sais pas, passer</button></div>
  </div>`;
}

// r = { label, lat, lon, level, postcode, c: {code, nom, slug, dep, depNom, depSlug, arretes, annees, rga, cp} }
export function pageResultat(r) {
  state.r = r;
  const s = scoreFor(), lv = niveau(s.total), c = r.c, n = c.arretes.length, nom = esc(c.nom), last = c.arretes[0];
  const fondsOk = !!PILOTES[c.dep];
  const resume = r.level === 0 ? "La carte officielle ne classe pas votre adresse en zone argileuse exposée"
    : `Votre adresse est sur un sol argileux classé en ${["", "exposition faible", "exposition moyenne", "exposition forte"][r.level]}`;
  return `
  <div class="band verdict-band"><div class="wrap">
    <p class="crumbs" style="color:inherit"><a href="/">Accueil</a> › <a href="/argile/${c.depSlug}/">${esc(c.depNom)}</a> › <a href="/argile/${c.slug}/">${nom}</a> › Mon adresse</p>
    <h1 style="margin-top:12px">Risque de fissure : ${esc(r.label)}</h1>
    <div class="verdict">
      ${gauge(s.total, "g-top")}
      <div class="stack" style="gap:10px">
        <span class="lvl lvl${lv}" id="lvl-top" style="justify-self:start">${NIV[lv]}</span>
        <p style="font-size:21px" id="phr-top">${NIVPHRASE[lv]}</p>
        <p class="why" id="why-top">${whyText(r, s, lv)}</p>
        <p class="note" style="color:inherit;opacity:.8">Indice indicatif, calculé avec des données publiques. Il ne remplace pas l'avis d'un expert.</p>
      </div>
    </div>
  </div></div>

  <section class="blk tight"><div class="wrap stack" style="gap:28px">
    <div class="tiles">
      <div class="tile rv" style="border-top-color:${NIVCOL[r.level]}"><div class="t">${def("Sol sous l'adresse", DEFS.expo)}</div><div class="v">${EXPO[r.level]}</div><p>Carte officielle 2026.${r.level >= 2 ? " Une étude de sol est obligatoire pour vendre un terrain à bâtir ici." : ""}</p></div>
      <div class="tile rv" style="border-top-color:var(--r2);transition-delay:.1s"><div class="t">Sécheresses reconnues ${aCommune(nom)}</div><div class="v num">${n} ${def(n > 1 ? "arrêtés" : "arrêté", DEFS.catnat)}</div><p>${n ? `${c.annees.length} année${c.annees.length > 1 ? "s" : ""} touchée${c.annees.length > 1 ? "s" : ""} depuis 1989. Dernier arrêté publié le ${isoFR(last[3])}.` : "Aucune depuis 1989."}</p>${n ? `<p><a href="#vol-catnat" data-openvol="vol-catnat">Voir les arrêtés ›</a></p>` : ""}</div>
      <a class="tile rv" href="#questions" data-jump="questions" style="border-top-color:var(--accent-2);transition-delay:.2s;text-decoration:none"><div class="t">Autour de votre maison</div><div class="v" id="tile-m">À compléter</div><p style="color:var(--link)">Répondre à 3 questions ›</p></a>
    </div>
    <div class="split-res"><div class="stack" style="gap:16px"><p class="summary rv"><strong>En résumé.</strong> ${resume}${n ? `, dans une commune où l'État a reconnu la sécheresse ${n === 1 ? "une fois" : n + " fois"}` : ""}.</p>${shareRow()}</div>
      <div class="minimap rv"><h3>Votre adresse sur la carte des argiles</h3><div id="map" class="map" role="img" aria-label="Carte des zones argileuses autour de votre adresse"></div>
        <div class="mapkey"><span><i style="background:var(--r3)"></i>Forte</span><span><i style="background:var(--r2)"></i>Moyenne</span><span><i style="background:var(--r1)"></i>Faible</span></div>
        <p class="note">Carte d'exposition 2026 (BRGM), fond de carte IGN.</p></div></div>
  </div></section>

  <section class="blk tight" style="padding-top:12px"><div class="wrap">
    <div class="sec-head" style="margin-bottom:24px"><p class="kicker">La priorité</p><h2>Que faire maintenant ? Votre plan d'action</h2><p class="note">Un plan par étapes : plus le risque est élevé, plus il y a de mesures. Les mesures des niveaux supérieurs restent visibles en gris.</p></div>
    <div class="plan" id="actions">${actionsHTML()}</div>
    <div class="info rv" style="border-left:5px solid var(--r2)"><strong>Été 2026 : une sécheresse des sols historique.</strong> Selon Météo-France, les sols de France sont restés à un niveau de sécheresse record tout au long de septembre 2026. ${has2026(c) ? `Un arrêté couvre déjà une sécheresse de 2026 ${aCommune(nom)}.` : `Aucun arrêté ne couvre encore 2026 ${aCommune(nom)} : la mairie a 24 mois pour déposer sa demande. Fissures récentes ? Signalez-les dès maintenant à la mairie.`} <a href="/fissure-maison/modeles-de-lettres/">Modèle de lettre</a></div>
    <div class="info rv">${fondsOk ? `${leDep(esc(c.depNom))} fait partie des 11 départements où l'État aide à financer ces gestes, avec le Fonds prévention argile.` : `L'État aide à financer ces gestes dans 11 départements, avec le Fonds prévention argile. ${leDep(esc(c.depNom))} n'en fait pas partie.`} <a href="#vol-fonds" data-openvol="vol-fonds">Comprendre ce fonds</a></div>
    <div class="cta-row"><a class="btn btn-main" href="/fissure-maison/">J'ai déjà des fissures : que faire ?</a><a class="btn btn-ghost" href="/fissure-maison/assurance/" style="color:var(--ink)">Fissures et assurance</a></div>
  </div></section>

  <section class="blk tight" id="questions"><div class="wrap">
    <div class="sec-head" style="margin-bottom:24px"><p class="kicker">Une minute</p><h2>Affinez votre risque en 3 questions</h2><p class="note">Le compteur à côté de chaque question montre l'effet de votre réponse.</p></div>
    <div class="wizard">
      <div class="wz-main" id="wz">${wizardHTML()}</div>
      <div class="wz-side" aria-live="polite">
        <span class="delta" id="delta"></span>
        <p class="kicker" style="margin:0">Votre indice</p>
        ${gauge(s.total, "g-side")}
        <span class="lvl lvl${lv}" id="lvl-side">${NIV[lv]}</span>
        ${mixBar(s)}
      </div>
    </div>
  </div></section>

  <section class="blk tight" id="details"><div class="wrap vols">
    <details class="vol" id="vol-catnat"><summary>${n ? `Les ${n > 1 ? n + " arrêtés" : "arrêté"} « sécheresse » ${aCommune(nom)}` : `Les sécheresses ${aCommune(nom)}`}${pmIcon}</summary><div class="in">${chartAnnees(c)}${n ? arretesTable(c) : ""}<p class="note" style="margin-top:12px">Chaque barre est une année couverte par au moins un arrêté « sécheresse ».</p><div style="margin-top:20px">${suivreHTML(c)}</div></div></details>
    <details class="vol" id="vol-fonds"><summary>Le Fonds prévention argile, c'est quoi ?${pmIcon}</summary><div class="in">${fondsExplainer(c.dep, leDep(esc(c.depNom)), nom)}</div></details>
    ${vol("Vous vendez ou achetez un terrain ?", `<p>En zone d'exposition moyenne ou forte, le vendeur d'un terrain à bâtir doit fournir une étude de sol préalable, ${def("dite G1", DEFS.g1)}, valable 30 ans. Pour construire, une étude de conception (G2) est ensuite obligatoire.</p><p style="margin-top:10px"><a href="/etude-de-sol-g1-g2/">Étude de sol G1 et G2 : obligations</a></p>`)}
    <p class="note">Ce que l'indice ne dit pas : la carte décrit des formations géologiques, pas votre parcelle, et l'indice ne connaît ni vos fondations ni l'état de vos murs. <a href="/methode/">Méthode et limites</a></p>
    <p class="note" style="margin-top:6px">Point : ${r.lat.toFixed(5).replace(".", ",")} N, ${r.lon.toFixed(5).replace(".", ",")} E. Sources : carte d'exposition au retrait-gonflement des argiles 2026 (BRGM, via data.gouv.fr) ; arrêtés : base GASPAR ; adresse : Géoplateforme de l'IGN.</p>
    <p style="margin-top:6px"><a href="/argile/${c.slug}/">Tout sur l'argile ${aCommune(nom)} ›</a></p>
  </div></section>`;
}
