// Rendu des pages : fonctions qui renvoient du HTML (reprises de la maquette validée)
/* ================= DONNÉES RÉELLES (relevées le 14 novembre 2026) ================= */
// Exposition officielle au RGA (carte 2026), relevée point par point via l'API Géorisques /api/v1/rga
export const EXPO = {0:"Non exposé",1:"Exposition faible",2:"Exposition moyenne",3:"Exposition forte"};
export const PILOTES = {"03":"Allier","04":"Alpes-de-Haute-Provence","24":"Dordogne","32":"Gers","36":"Indre","47":"Lot-et-Garonne","54":"Meurthe-et-Moselle","59":"Nord","63":"Puy-de-Dôme","81":"Tarn","82":"Tarn-et-Garonne"};
// Google Trends, « fissure maison », France, semaines du 9 nov. 2025 au 8 nov. 2026 (relevé du 14/11/2026)
export const TRENDS = [49,28,24,28,25,32,31,37,42,40,38,25,30,35,24,30,45,39,41,39,37,47,28,38,42,30,39,48,32,34,31,38,41,34,50,46,67,51,65,94,86,82,75,90,81,100,86,77,72,63,64,58,49];

/* ================= INDICE (proposition à valider) ================= */
export const SOL_PTS = {0:0,1:1.5,2:3.5,3:5.5};
export const ptsSecheresse = n => n===0?0:n<=3?0.5:n<=9?1:1.5;
export const niveau = x => x<3?0:x<5.5?1:x<8?2:3;
export const NIV = ["Risque faible","Risque modéré","Risque élevé","Risque très élevé"];
export const NIVCOURT = ["Faible","Modéré","Élevé","Très élevé"];
export const NIVCOL = ["var(--r0)","var(--r1)","var(--r2)","var(--r3)"];
export const NIVPHRASE = [
  "Le sol est peu ou pas exposé. Une fissure peut avoir d'autres causes que l'argile.",
  "Le sol peut bouger lors des fortes sécheresses. Quelques gestes simples limitent le risque.",
  "Le sol argileux et les sécheresses passées font de votre maison un cas à surveiller.",
  "Plusieurs facteurs se cumulent. Un diagnostic par un professionnel est conseillé."
];
export const QUESTIONS = [
  {k:"arbre", q:"Un arbre de plus de 5 m pousse-t-il à moins de 10 m de la maison ?", help:"Ses racines puisent l'eau sous les fondations en été, parfois loin du tronc.",
   opts:[["oui","Oui",1.5],["non","Non",0]]},
  {k:"eau", q:"L'eau des gouttières s'écoule-t-elle au pied des murs ?", help:"Un sol tour à tour détrempé puis sec bouge davantage.",
   opts:[["oui","Oui, ou je ne sais pas",0.75],["non","Non, elle est évacuée plus loin",0]]},
  {k:"annee", q:"Quand la maison a-t-elle été construite ?", help:"Depuis le 1er octobre 2020, une étude de sol est obligatoire pour faire construire une maison en zone moyenne ou forte.",
   opts:[["avant","Avant 2021",0.75],["apres","En 2021 ou après",0]]}
];


/* ================= OUTILS ================= */
export const $ = s=>document.querySelector(s);
export const dec = n => String(Math.round(n*100)/100).replace(".",",");
export const ico = {
  sol:`<svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 10h24M3 17h24M3 24h24"/><path d="M9 10l2 7-2 7M20 10l-2 7 3 7"/></svg>`,
  sec:`<svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="15" cy="11" r="5"/><path d="M15 2v2M15 18v2M6 11H4M26 11h-2M8.6 4.6l1.4 1.4M20 16l1.4 1.4M21.4 4.6 20 6M10 16l-1.4 1.4M4 26h22M10 26l2-3M18 26l-2-3"/></svg>`,
  maison:`<svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"><path d="M3 15 12 7l9 8v10H3z"/><path d="M9 25v-6h6v6"/><circle cx="24" cy="11" r="4"/><path d="M24 15v10"/></svg>`,
  eau:`<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M14 3s7 8 7 13a7 7 0 0 1-14 0c0-5 7-13 7-13z"/></svg>`,
  arbre:`<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="14" cy="10" r="7"/><path d="M14 17v9M9 26h10"/></svg>`,
  trot:`<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M6 18V9l7-5 7 5v9"/><path d="M2 22h24M2 18h24"/></svg>`,
  fuite:`<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 9h12a4 4 0 0 1 4 4v3"/><path d="M19 20s2 2.5 2 4a2 2 0 0 1-4 0c0-1.5 2-4 2-4z"/></svg>`,
  ok:`<svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l5 5 11-11"/></svg>`,
  lock:`<svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><rect x="5" y="11" width="16" height="11" rx="2"/><path d="M8 11V8a5 5 0 0 1 10 0v3"/></svg>`,
  scale:`<svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M13 3v20M6 23h14M4 8h18M4 8l-3 7h6zM22 8l-3 7h6z"/></svg>`,
  link:`<svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M11 15a5 5 0 0 0 7 0l4-4a5 5 0 0 0-7-7l-1 1M15 11a5 5 0 0 0-7 0l-4 4a5 5 0 0 0 7 7l1-1"/></svg>`
};
export const pmIcon = `<span class="pm" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M3 8h10"/><path class="v" d="M8 3v10" style="transform-origin:center"/></svg></span>`;

export function gauge(score, id){
  const lv=niveau(score);
  return `<svg class="gauge" ${id?`id="${id}"`:""} viewBox="0 0 150 118" role="img" aria-label="Indice ${dec(score)} sur 10">
    <path d="M17 85a58 58 0 0 1 116 0" fill="none" stroke="var(--line)" stroke-width="14" stroke-linecap="round"/>
    <path class="arc" d="M17 85a58 58 0 0 1 116 0" fill="none" stroke="${NIVCOL[lv]}" stroke-width="14" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="${100-score*10}"/>
    <text class="gv" x="75" y="80" text-anchor="middle" style="font:800 34px var(--display);fill:var(--ink)">${dec(score)}</text>
    <text x="75" y="104" text-anchor="middle" style="font:600 14px var(--body);fill:var(--muted)">sur 10</text></svg>`;
}
export const chip = code => `<span class="tag" style="background:${NIVCOL[code]};color:${code==1?'#1b1503':'#fff'}">${EXPO[code].replace("Exposition ","")}</span>`;
export const vol = (title, inner, open) => `<details class="vol"${open?" open":""}><summary>${title}${pmIcon}</summary><div class="in">${inner}</div></details>`;

/* ================= BLOC « COMMENT ON CALCULE » ================= */
export function blocCalcul(withHead=true){
  return `<section class="blk dark"><div class="wrap">
    ${withHead?`<div class="sec-head"><p class="kicker">La méthode</p><h2>Votre risque, sur 10 points</h2><p class="lead">Trois facteurs, tous tirés de données publiques ou de vos réponses. Le niveau officiel du sol est toujours affiché tel quel, à côté.</p></div>`:""}
    <div class="calc">
      <div class="factor rv"><div class="ico" style="background:var(--r3)">${ico.sol}</div>
        <div class="pts">jusqu'à 5,5 <small>points</small></div><h3>Le sol sous la maison</h3>
        <p>Carte officielle 2026 du BRGM.</p>
        <ul><li>Non exposé : 0</li><li>Faible : 1,5</li><li>Moyen : 3,5</li><li>Fort : 5,5</li></ul></div>
      <div class="factor rv" style="transition-delay:.12s"><div class="ico" style="background:var(--r2)">${ico.sec}</div>
        <div class="pts">jusqu'à 1,5 <small>points</small></div><h3>Les sécheresses passées</h3>
        <p>Arrêtés « catastrophe naturelle » dans la commune depuis 1989.</p>
        <ul><li>Aucun : 0</li><li>1 à 3 : 0,5</li><li>4 à 9 : 1</li><li>10 et plus : 1,5</li></ul></div>
      <div class="factor rv" style="transition-delay:.24s"><div class="ico" style="background:var(--accent-2)">${ico.maison}</div>
        <div class="pts">jusqu'à 3 <small>points</small></div><h3>Autour de la maison</h3>
        <p>Trois questions, une minute.</p>
        <ul><li>Grand arbre à moins de 10 m : 1,5</li><li>Construite avant 2021 : 0,75</li><li>Eau au pied des murs : 0,75</li></ul></div>
    </div>
    <div class="scale10 rv">
      <div class="barwrap grow" role="img" aria-label="Répartition des 10 points : sol 5,5, sécheresses 1,5, maison 3">
        <div class="seg" style="width:55%;background:var(--r3)"></div><div class="seg" style="width:15%;background:var(--r2)"></div><div class="seg" style="width:30%;background:var(--accent-2)"></div></div>
      <div class="legend"><span>0</span><span>Sol · 5,5</span><span>Sécheresses · 1,5</span><span>Maison · 3</span><span>10</span></div>
      <div class="levels"><div style="background:var(--r0)">Faible</div><div style="background:var(--r1)">Modéré</div><div style="background:var(--r2)">Élevé</div><div style="background:var(--r3)">Très élevé</div></div>
      <div class="legend"><span>0</span><span>3</span><span>5,5</span><span>8</span><span>10</span></div>
    </div>
    <div class="example rv"><span>Exemple, Toulouse, Côte Pavée :</span> <b>5,5</b> sol fort <b>+ 1,5</b> 19 sécheresses <b>+ 0</b> sans réponse <b>= 7 / 10</b> <span class="lvl lvl2">Risque élevé</span></div>
    <p style="margin-top:20px"><a href="#methode" style="color:#fff">Détail de la méthode et limites</a></p>
  </div></section>`;
}


export function blocSimple(){
  return `<section class="blk dark"><div class="wrap">
    <div class="sec-head"><p class="kicker">La méthode</p><h2>Comment on évalue votre risque</h2><p class="lead">On regarde trois choses, puis on les additionne.</p></div>
    <div class="eq">
      <div class="f rv"><div class="ico" style="background:var(--r3)">${ico.sol}</div><h3>Le sol est&#8209;il argileux&nbsp;?</h3></div>
      <div class="op" aria-hidden="true">+</div>
      <div class="f rv" style="transition-delay:.12s"><div class="ico" style="background:var(--r2)">${ico.sec}</div><h3>La sécheresse a&#8209;t&#8209;elle déjà frappé&nbsp;?</h3></div>
      <div class="op" aria-hidden="true">+</div>
      <div class="f rv" style="transition-delay:.24s"><div class="ico" style="background:var(--accent-2)">${ico.maison}</div><h3>Qu'y a&#8209;t&#8209;il autour de la maison&nbsp;?</h3></div>
      <div class="op" aria-hidden="true">=</div>
      <div class="res rv" style="transition-delay:.36s"><h3>Votre risque</h3>
        <div class="chips"><span style="background:var(--r0)">Faible</span><span style="background:var(--r1);color:#1b1503">Modéré</span><span style="background:var(--r2)">Élevé</span><span style="background:var(--r3)">Très élevé</span></div></div>
    </div>
    <p style="margin-top:28px"><a href="#methode" style="color:#fff">Voir le détail du calcul</a></p>
  </div></section>`;
}


/* ================= COMPOSANTS COMMUNS ================= */
export const normz = t => t.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu,"");
// Autocomplétion accessible : flèches, Entrée, Échap
// Recherche plein écran (depuis toutes les pages)
// Bulle de définition
export function def(term, text){ return `<button type="button" class="def" aria-expanded="false" data-def="${text.replace(/"/g,"&quot;")}">${term}</button>`; }
export const DEFS = {
  expo:"Le niveau donné par la carte officielle de l'État (BRGM, 2026) : non exposé, faible, moyen ou fort. Il dit si le sol contient des argiles qui gonflent et se rétractent.",
  catnat:"Un arrêté de catastrophe naturelle « sécheresse » est publié au Journal officiel quand l'État reconnaît une sécheresse exceptionnelle dans une commune. Sans lui, l'assurance ne couvre pas les fissures.",
  g1:"L'étude de sol G1 est une étude géotechnique préalable que le vendeur d'un terrain à bâtir doit fournir en zone moyenne ou forte. Elle est valable 30 ans."
};
// Pourquoi ce niveau ?
// Carte simplifiée des points testés (positions réelles, sans fond de carte)
// Partage et impression
export function shareRow(){
  return `<div class="share" id="share"><button type="button" data-act="copy"><svg width="18" height="18" viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M11 15a5 5 0 0 0 7 0l4-4a5 5 0 0 0-7-7l-1 1M15 11a5 5 0 0 0-7 0l-4 4a5 5 0 0 0 7 7l1-1"/></svg>Copier le lien</button><button type="button" data-act="print"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9V3h12v6M6 17H4v-6h16v6h-2M7 14h10v7H7z"/></svg>Imprimer</button><button type="button" data-act="other">Tester une autre adresse</button><span class="msg" aria-live="polite"></span></div>`;
}
// Barre de score fixe
// Adresses prévues sur le vrai site et indexation Google
/* ================= ACCUEIL : DONNÉES D'AFFICHAGE ================= */
export const G_ICONS={
 "lettres":[`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1205" stroke-width="2.2" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>`,"var(--band)"],
 "fissurometre":[`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1205" stroke-width="2.2"><rect x="2" y="7" width="20" height="10" rx="1.5"/><path d="M6 7v4M10 7v3M14 7v4M18 7v3"/></svg>`,"var(--band)"],
 "guide-fissure":[`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"><path d="M3 11 12 4l9 7v9H3z"/><path d="M12 8l-2 4 3 2-2 5"/></svg>`,"var(--r3)"],
 "guide-assurance":[`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>`,"var(--accent)"],
 "guide-fonds":[`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M17 6.5A6.5 6.5 0 1 0 17 17.5M4 10.5h9M4 13.5h9"/></svg>`,"var(--accent-2)"],
 "guide-etude":[`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M3 9h18M3 14h18M3 19h18M12 3v13"/><circle cx="12" cy="17" r="1.5" fill="#fff"/></svg>`,"var(--r1)"],
 "guide-grave":[`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2"><path d="M4 20h16M7 20V8l3 4 3-6 2 5 2-2v11"/></svg>`,"var(--r2)"]
};
export const FAQ=[
 ["Comment savoir si ma maison est sur un sol argileux ?","Entrez votre adresse en haut de cette page : nous affichons le niveau de la carte officielle de l'État (2026), de « non exposé » à « fort ». Seule une étude de sol dit précisément ce qu'il y a sous votre maison.","accueil","Tester mon adresse"],
 ["Pourquoi les maisons se fissurent-elles après une sécheresse ?","Un sol argileux se rétracte quand il sèche et gonfle quand il se réhumidifie. Les fondations peu profondes des maisons suivent ces mouvements, ce qui peut fissurer les murs.","methode","Comprendre le calcul"],
 ["Quelle fissure est grave ?","Une fissure de moins de 0,2 mm touche souvent l'enduit seul. Au-delà de 2 mm, en escalier ou traversante, faites venir un expert. Ces seuils sont indicatifs.","guide-grave","Voir les schémas"],
 ["Mon assurance couvre-t-elle les fissures ?","Oui, si l'État reconnaît la sécheresse dans votre commune par un arrêté de catastrophe naturelle. Vous avez alors 30 jours pour déclarer le sinistre, avec une franchise de 1&nbsp;520&nbsp;€.","guide-assurance","Fissures et assurance"],
 ["Existe-t-il une aide pour protéger ma maison ?","Dans 11 départements, le Fonds prévention argile finance un diagnostic et des travaux de prévention, de 50 % à 90 % selon vos revenus. Ailleurs, les gestes de prévention sont à votre charge.","guide-fonds","Le Fonds prévention argile"],
 ["L'étude de sol est-elle obligatoire pour vendre ?","Pour vendre un terrain à bâtir en zone moyenne ou forte, oui : le vendeur fournit une étude G1, valable 30 ans. Pour une maison déjà construite, la carte n'impose rien.","guide-etude","Étude de sol G1 et G2"],
 ["Quelle différence avec Géorisques ?","Géorisques est le site officiel de l'État sur tous les risques : il publie la carte des argiles et les arrêtés de catastrophe naturelle, et produit l'état des risques obligatoire pour vendre ou louer. Argile Arena est un site indépendant qui réutilise ces données publiques pour un seul sujet, les fissures : il les croise avec quelques questions sur votre maison, les traduit en un niveau de risque, et dit quoi faire (démarches, délais d'assurance, lettres, aides). Pour un document officiel, c'est Géorisques qui fait foi.","a-propos","Nos sources"],
 ["Le site peut-il dire si ma maison va se fissurer ?","Non. Nous donnons un niveau de risque à partir de données publiques. Seul un professionnel, sur place, peut juger l'état de votre maison et de ses fondations.","a-propos","Nos engagements"]
];

/* ================= ACCUEIL ================= */
export const houseIll = `<svg class="hero-ill" viewBox="0 0 320 260" role="img" aria-label="Maison sur un sol argileux qui se fend">
  <rect x="0" y="178" width="320" height="82" fill="var(--accent)" opacity=".35"/>
  <path d="M0 178h320" stroke="var(--band-ink)" stroke-width="3"/>
  <path d="M40 200l18 14-8 16 14 14M120 196l-10 18 16 10-6 22M210 198l12 16-12 14 10 18M280 200l-14 14 10 20" stroke="var(--band-ink)" stroke-width="2.5" fill="none" opacity=".55"/>
  <path d="M80 178V104l80-62 80 62v74z" fill="var(--surface)" stroke="var(--band-ink)" stroke-width="4" stroke-linejoin="round"/>
  <path d="M64 112l96-76 96 76" fill="none" stroke="var(--bar)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="104" y="118" width="34" height="30" fill="var(--band)" stroke="var(--band-ink)" stroke-width="3"/>
  <rect x="176" y="128" width="36" height="50" fill="var(--band)" stroke="var(--band-ink)" stroke-width="3"/>
  <path d="M150 84l-6 18 10 14-8 18 6 12-4 32" stroke="var(--r3)" stroke-width="3.5" fill="none" stroke-linejoin="round"/>
  <circle cx="276" cy="110" r="30" fill="var(--accent-2)" opacity=".8"/><rect x="272" y="130" width="8" height="48" fill="var(--band-ink)"/>
</svg>`;

/* ================= RÉSULTAT ================= */
export function mixBar(s){
  return `<div class="mix"><div class="bar"><span style="width:${s.sol*10}%;background:var(--r3)"></span><span style="width:${s.sec*10}%;background:var(--r2)"></span><span class="mb" style="width:${s.maison*10}%;background:var(--accent-2)"></span></div>
  <div class="key"><span><i style="background:var(--r3)"></i>Sol ${dec(s.sol)}</span><span><i style="background:var(--r2)"></i>Sécheresses ${dec(s.sec)}</span><span><i style="background:var(--accent-2)"></i>Maison <b class="mv">${dec(s.maison)}</b></span></div></div>`;
}
// Plan d'action gradué : chaque niveau ajoute des mesures aux précédents
export const PLAN = [
  {lv:0, titre:"Pour toutes les maisons", items:[
    {k:"eau",i:"eau",t:"Éloigner l'eau de pluie des murs",d:"Descentes de gouttières raccordées ou rejetées loin de la façade. Pas de flaque ni d'arrosage au pied des murs."},
    {i:"fuite",t:"Vérifier les canalisations enterrées",d:"Une fuite détrempe le sol sous les fondations. Surveillez votre compteur d'eau la nuit."},
    {i:"ok",t:"Surveiller et dater les fissures",d:"Photo avec une règle, trait de crayon daté à chaque bout, surtout en fin d'été."}]},
  {lv:1, titre:"Si le risque est modéré", items:[
    {i:"trot",t:"Un trottoir étanche autour de la maison",d:"Au moins 1 m de large, jusqu'à 1,5 m selon la maison, ou une membrane enterrée : le sol garde la même humidité au pied des murs."},
    {k:"arbre",i:"arbre",t:"Garder les arbres à bonne distance",d:"Un arbre à moins de 1,5 fois sa hauteur de la maison peut assécher le sol sous les fondations. Élaguer ne suffit pas : ce sont les racines qui pompent l'eau."}]},
  {lv:2, titre:"Si le risque est élevé", items:[
    {i:"eau",t:"Un drainage, seulement si l'eau arrive vers la maison",d:"Utile surtout sur un terrain en pente, quand la maison fait barrage au ruissellement. Le drain se place à au moins 1 à 1,5 m de la maison, séparé des eaux de pluie, avec une sortie en aval. Jamais en pied de façade : il piégerait l'eau sous les fondations. À faire étudier par un professionnel."},
    {k:"arbre",i:"arbre",t:"Un écran anti-racines si un arbre est trop proche",d:"Une barrière enterrée d'au moins 2 m de profondeur, entre l'arbre et la maison."},
    {i:"fuite",t:"Faire inspecter les canalisations",d:"Un passage de caméra repère les fuites et les raccords cassés."}]},
  {lv:3, titre:"Si le risque est très élevé", items:[
    {i:"scale",t:"Un diagnostic par un professionnel",d:"Un bureau d'études examine la maison, le sol et l'environnement, et classe les travaux par priorité."},
    {k:"arbre",i:"arbre",t:"Demander un avis avant de couper ou d'abattre",d:"Couper des racines peut fragiliser l'arbre, et son retrait change l'humidité du sol : un professionnel dit quoi faire et dans quel ordre."},
    {i:"sol",t:"Toucher aux fondations seulement après étude",d:"Renforcer les fondations est lourd et coûteux : à envisager uniquement en cas de dégâts, après une étude de sol."}]}
];
/* ================= ESTIMATEUR (barème Anah 2026, hors Île-de-France) ================= */
export const ANAH26 = {tmo:[17363,25393,30540,35676,40835,5151], mo:[22259,32553,39148,45735,52348,6598], int:[31185,45842,55196,64550,73907,9357]};
export const plaf=(k,n)=>n<=5?ANAH26[k][n-1]:ANAH26[k][4]+(n-5)*ANAH26[k][5];
export const CATS={tmo:["Très modeste","var(--accent-2)",.9,.8],mo:["Modeste","var(--accent)",.85,.7],int:["Intermédiaire","var(--r1)",.7,.5]};
export const eur=n=>Math.round(n).toLocaleString("fr-FR")+" €";
export function estimHTML(){
  return `<div class="est" id="est"><div class="inp">
    <label for="e-n">Personnes dans le foyer<select id="e-n">${[1,2,3,4,5,6,7].map(n=>`<option ${n===2?"selected":""}>${n}</option>`).join("")}</select></label>
    <label for="e-r">Revenu fiscal de référence (€ par an)<input id="e-r" inputmode="numeric" value="30000"></label>
    <p class="note">Il figure en haut de votre avis d'impôt. Barème 2026 hors Île-de-France (les 11 départements pilotes en font tous partie).</p>
  </div><div class="out" aria-live="polite" id="e-out"></div></div>`;
}
/* ================= FONDS PRÉVENTION ARGILE ================= */
export function fondsExplainer(dep, nomDep, commune){
  const ok = !!PILOTES[dep];
  return `<div class="fx">
    <div class="q4">
      <div class="rv"><b>C'est quoi ?</b><span>Une aide de l'État pour protéger une maison <em>avant</em> les gros dégâts : un diagnostic, puis des travaux de prévention.</span></div>
      <div class="rv" style="transition-delay:.08s"><b>Qui décide ?</b><span>Le ministère de la Transition écologique fixe les règles. Les services du préfet dans le département instruisent les dossiers, déposés en ligne.</span></div>
      <div class="rv" style="transition-delay:.16s"><b>Pour qui ?</b><span>Propriétaires qui habitent leur maison, en zone d'exposition forte, sous conditions de ressources, dans 11 départements.</span></div>
      <div class="rv" style="transition-delay:.24s"><b>Combien ?</b><span>De 50 % à 90 % des dépenses selon vos revenus. 30 millions d'euros prévus au budget 2026.</span></div>
    </div>
    <div><h3 style="margin-bottom:16px">Comment ça se passe</h3>
      <div class="flow rv">
        <div><b>Simulateur</b>Vous vérifiez votre éligibilité en ligne.</div>
        <div><b>Conseiller local</b>Gratuit, mandaté par l'État dans le département.</div>
        <div><b>Diagnostic</b>Un professionnel inspecte la maison et les canalisations.</div>
        <div><b>Travaux</b>Gouttières, drainage, arbres, trottoir étanche.</div>
        <div><b>Paiement</b>L'aide est versée sur factures, à la fin de chaque étape.</div>
      </div></div>
    <div class="here rv">${ok
      ? `<strong>${nomDep} fait partie des 11 départements.</strong><span>Si votre maison est en zone d'exposition forte, vérifiez votre éligibilité sur le simulateur officiel.</span>`
      : `<strong>Et ${commune ? "à "+commune : "chez vous"} ?</strong><span>${nomDep} ne fait pas partie des 11 départements choisis par l'État pour tester le fonds depuis octobre 2025. Le gouvernement devait décider à l'automne 2026 s'il l'étend à d'autres départements ; aucune extension n'est annoncée à ce jour.</span><span>En attendant, les gestes de prévention restent à votre charge, et en cas de fissures, c'est la garantie catastrophe naturelle de votre assurance qui peut jouer.</span>`}
      <span><a href="#guide-fonds">Tout sur le Fonds prévention argile</a></span></div>
  </div>`;
}

/* ================= VILLE ================= */
/* ================= INFOGRAPHIES ================= */
export function barsH(rows, max){
  const W=720,rh=54,H=rows.length*rh+6,X=310;
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${rows.map(r=>r[0]+' : '+r[2]).join(' ; ')}">
  ${rows.map((r,i)=>{const w=Math.max(4,(W-X-110)*r[1]/max);return `<text class="lab" x="0" y="${i*rh+30}">${r[0]}</text><rect class="grow" style="transition-delay:${i*.18}s" x="${X}" y="${i*rh+10}" width="${w}" height="28" rx="4" fill="${r[3]||'var(--accent)'}"/><text x="${X+8+w}" y="${i*rh+30}" class="lab">${r[2]}</text>`}).join("")}</svg>`;
}
export function donut(pct, label, col){
  const C=2*Math.PI*54;
  return `<div class="donut"><svg viewBox="0 0 140 140" role="img" aria-label="${label} : ${pct} %"><circle cx="70" cy="70" r="54" fill="none" stroke="var(--line)" stroke-width="18"/>
  <circle class="ring" cx="70" cy="70" r="54" fill="none" stroke="${col}" stroke-width="18" stroke-dasharray="${C}" data-off="${C*(1-pct/100)}" stroke-dashoffset="${C}" transform="rotate(-90 70 70)"/>
  <text x="70" y="78" text-anchor="middle" style="font:800 28px var(--display);fill:var(--ink)">${pct} %</text></svg><span>${label}</span></div>`;
}
export function housesGrid(n, col, label){
  const h=`<svg viewBox="0 0 20 20"><path d="M2 10 10 3l8 7v8H2z" fill="CUR"/></svg>`;
  return `<div class="houses" role="img" aria-label="${label}">${Array.from({length:100},(_,i)=>h.replace("CUR",i<n?col:"var(--line)").replace("<svg",`<svg style="transition-delay:${i*12}ms"`)).join("")}</div>`;
}
export function trendsChart(){
  const W=680,H=220,pad=30,n=TRENDS.length,xs=i=>pad+i*(W-2*pad)/(n-1),ys=v=>H-34-v*(H-60)/100;
  const d=TRENDS.map((v,i)=>`${i?"L":"M"}${xs(i).toFixed(1)} ${ys(v).toFixed(1)}`).join(" ");
  const area=d+` L${xs(n-1)} ${H-34} L${xs(0)} ${H-34}Z`;
  const months=[["déc.",3],["fév.",12],["avr.",21],["juin",30],["août",39],["oct.",47]].map(([m,i])=>`<text x="${xs(i)}" y="${H-10}" text-anchor="middle">${m}</text>`).join("");
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Intérêt de recherche pour « fissure maison » : environ 32 en hiver, 84 en août et septembre, maximum 100 la semaine du 20 septembre 2026">
   <line x1="${pad}" y1="${ys(0)}" x2="${W-pad}" y2="${ys(0)}" stroke="var(--line)"/><line x1="${pad}" y1="${ys(50)}" x2="${W-pad}" y2="${ys(50)}" stroke="var(--line)" stroke-dasharray="3 4"/>
   <rect x="${xs(38)}" y="20" width="${xs(48)-xs(38)}" height="${H-54}" fill="var(--r1)" opacity=".15"/>
   <path d="${area}" fill="var(--accent)" opacity=".15"/>
   <path class="draw" style="--len:100" pathLength="100" d="${d}" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linejoin="round"/>
   <circle cx="${xs(45)}" cy="${ys(100)}" r="6" fill="var(--r3)"/><text class="lab" x="${xs(45)-8}" y="${ys(100)-4}" text-anchor="end">100 : semaine du 20 sept.</text>
   <text x="${xs(43)}" y="${H-40}" text-anchor="middle" style="font-weight:700;fill:var(--ink)">août-sept.</text>
   ${months}</svg>`;
}
export function costMini(){return `<svg class="mini" viewBox="0 0 120 64" aria-hidden="true"><rect class="growy" x="8" y="57" width="26" height="6" fill="var(--accent-2)" rx="2"/><rect class="growy" style="transition-delay:.15s" x="46" y="38" width="26" height="25" fill="var(--r2)" rx="2"/><rect class="growy" style="transition-delay:.3s" x="84" y="4" width="26" height="59" fill="var(--r3)" rx="2"/></svg>`}


/* ================= DÉPARTEMENT ================= */
/* ================= AIDES ================= */
export function pageAides(){
  const A=[["guide-fonds","Fonds prévention argile","Avant les dégâts","Diagnostic et travaux de prévention aidés de 50 % à 90 %, dans 11 départements, selon vos revenus."],
           ["guide-assurance","Garantie catastrophe naturelle","Après les dégâts","Votre assurance habitation indemnise les fissures si la sécheresse est reconnue dans votre commune. Franchise : 1&nbsp;520&nbsp;€."],
           ["actu-secheresse-2026","Sécheresse 2026","À suivre","Votre commune a 24 mois pour demander la reconnaissance. Signalez vos fissures en mairie."],
           ["guide-etude","Étude de sol G1 et G2","Vente ou construction","Obligatoire pour vendre un terrain à bâtir ou faire construire en zone moyenne ou forte."]];
  return `<div class="band"><div class="wrap" style="padding-top:48px;padding-bottom:48px"><h1>Aides et recours</h1>
  <p class="lead" style="margin-top:14px">Ce qui existe avant les fissures, et ce qui joue après.</p></div></div>
  <section class="blk tight"><div class="wrap grid2">${A.map((a,i)=>`<a class="card rv" href="#${a[0]}" style="text-decoration:none;color:var(--ink);transition-delay:${(i%2)*.08}s;border-left-color:${i===0?"var(--accent-2)":i===1?"var(--accent)":i===2?"var(--r2)":"var(--r1)"}"><span class="tag" style="justify-self:start">${a[2]}</span><h3>${a[1]}</h3><p class="note">${a[3]}</p></a>`).join("")}</div></section>`;
}
/* ================= DOSSIER SÉCHERESSE 2026 ================= */
/* ================= ACTUALITÉS ================= */
export const ACTUS = [
  {id:"actu-secheresse-2026", type:"Dossier", t:"Sécheresse 2026 : votre commune est-elle reconnue ?", d:"Mis à jour à chaque nouvel arrêté", body:()=>actuSecheresse2026()},
  {id:"actu-insee", type:"Analyse", t:"Réchauffement : jusqu'à 8,7 millions de maisons fortement exposées à la fin du siècle", d:"3 novembre 2026 · Insee", body:()=>actuClimat()},
  {id:"actu-recherches", type:"Analyse", t:"Les recherches « fissure maison » font plus que doubler à la fin de l'été", d:"Google Trends, 12 derniers mois", body:()=>actuRecherches()},
  {id:"actu-cout", type:"Analyse", t:"Le coût des fissures a été multiplié par quatre", d:"Chiffres du ministère et de la CCR", body:()=>actuCout()},
  {id:"actu-carte", type:"Actualité", t:"Nouvelle carte des argiles : 12,1 millions de maisons concernées", d:"1er juillet 2026 · Ministère de la Transition écologique", body:()=>actuCarte()},
  {id:"actu-fonds", type:"Actualité", t:"Fonds prévention argile : les conditions assouplies depuis le 1er mai", d:"Arrêté du 23 avril 2026", body:()=>actuFonds()}
];
export function pageActus(){
  const mini={ "actu-insee":`<svg class="mini" viewBox="0 0 120 64" aria-hidden="true"><rect class="growy" x="8" y="62" width="26" height="1" fill="var(--accent-2)"/><rect class="growy" style="transition-delay:.15s" x="46" y="52" width="26" height="11" fill="var(--r2)" rx="2"/><rect class="growy" style="transition-delay:.3s" x="84" y="4" width="26" height="59" fill="var(--r3)" rx="2"/></svg>`,
    "actu-recherches":`<svg class="mini" viewBox="0 0 200 64" aria-hidden="true"><path class="draw" style="--len:100" pathLength="100" d="${TRENDS.map((v,i)=>`${i?"L":"M"}${(i*200/52).toFixed(1)} ${(62-v*.58).toFixed(1)}`).join(" ")}" fill="none" stroke="var(--accent)" stroke-width="3"/></svg>`,
    "actu-cout":costMini(),
    "actu-carte":`<svg class="mini" viewBox="0 0 140 64" aria-hidden="true"><rect class="grow" x="0" y="10" width="104" height="18" fill="var(--accent-2)" rx="3"/><rect class="grow" style="transition-delay:.2s" x="0" y="36" width="121" height="18" fill="var(--r2)" rx="3"/></svg>`,
    "actu-fonds":`<svg class="mini" viewBox="0 0 140 64" aria-hidden="true"><rect class="grow" x="0" y="6" width="126" height="14" fill="var(--accent-2)" rx="3"/><rect class="grow" style="transition-delay:.15s" x="0" y="25" width="119" height="14" fill="var(--accent)" rx="3"/><rect class="grow" style="transition-delay:.3s" x="0" y="44" width="98" height="14" fill="var(--r1)" rx="3"/></svg>`};
  return `<div class="band"><div class="wrap" style="padding-top:48px;padding-bottom:48px">
    <h1>Actualités et analyses</h1>
    <p class="lead" style="margin-top:14px">Les nouvelles règles, les aides et nos analyses chiffrées. Chaque article est daté et renvoie à sa source.</p>
  </div></div>
  <section class="blk tight"><div class="wrap">
    <div class="sec-head"><p class="kicker">En chiffres</p><h2>Le risque argile en quatre nombres</h2></div>
    <div class="statstrip">
      <div class="stat rv"><div class="big num" data-count="12.1" data-dec="1" data-suf=" M">12,1 M</div><span>maisons en zone moyenne ou forte</span></div>
      <div class="stat rv" style="border-color:var(--r3);transition-delay:.1s"><div class="big num" data-count="1.5" data-dec="1" data-suf=" Md€">1,5 Md€</div><span>de sinistres par an (2018-2022)</span></div>
      <div class="stat rv" style="border-color:var(--accent-2);transition-delay:.2s"><div class="big num" data-count="42" data-suf=" %">42 %</div><span>des dommages « catastrophe naturelle »</span></div>
      <div class="stat rv" style="border-color:var(--r1);transition-delay:.3s"><div class="big num" data-count="11">11</div><span>départements aidés par le Fonds</span></div>
    </div>
  </div></section>
  <section class="blk tight" style="padding-top:0"><div class="wrap grid2">
    ${ACTUS.map((a,i)=>`<a class="card rv" href="#${a.id}" style="text-decoration:none;color:var(--ink);transition-delay:${(i%2)*.1}s;border-left-color:${a.type==="Analyse"?"var(--accent-2)":"var(--accent)"}">
      <span class="tag" style="justify-self:start">${a.type}</span><h3>${a.t}</h3><p class="src">${a.d}</p>${mini[a.id]||""}</a>`).join("")}
  </div></section>`;
}
export function docShell(crumb, title, date, toc, inner){
  return `<div class="wrap"><p class="crumbs"><a href="#accueil">Accueil</a> › ${crumb}</p>
  <div class="doc"><aside class="toc"><strong>Sommaire</strong><ol>${toc.map(([id,t])=>`<li><a href="#${id}" data-scroll="${id}">${t}</a></li>`).join("")}</ol></aside>
  <article class="prose"><h1>${title}</h1><p class="src">${date}</p>${inner}</article></div></div>`;
}
export const srcBtn = u => `<p><a class="btn btn-ghost btn-sm" href="${u}" style="color:var(--ink)">Lire la source</a></p>`;
export function actuCout(){
  return docShell(`<a href="#actualites">Actualités</a> › Analyse`, "Le coût des fissures a été multiplié par quatre", "Analyse · chiffres vérifiés le 14 novembre 2026",
  [["b","En bref"],["c","Le coût par an"],["p","Le poids des argiles"],["n","Ce que ça change pour vous"]],
  `<div class="bref" id="b"><strong>En bref</strong><ul>
    <li>De 375 millions d'euros par an (1995-2015) à environ 1,5 milliard par an (2018-2022).</li>
    <li>La seule sécheresse de 2022 a coûté 3,5 milliards d'euros d'indemnisation.</li>
    <li>Les argiles pèsent 42 % des dommages indemnisés au titre des catastrophes naturelles.</li></ul></div>
  <h2 id="c">Le coût par an</h2>
  <div class="ig rv"><div class="callout"><span class="big num">× 4</span><span>entre la moyenne 1995-2015 et la moyenne 2018-2022</span></div>
   ${barsH([["1995-2015, par an",375,"375 M€","var(--accent-2)"],["2018-2022, par an",1500,"≈ 1 500 M€","var(--r2)"],["Année 2022 seule",3500,"3 500 M€","var(--r3)"]],3500)}
   <p class="src">Sources : CCR, via le ministère de la Transition écologique ; Fonds prévention argile (2022).</p></div>
  <h2 id="p">Le poids des argiles</h2>
  <div class="ig rv"><div class="donuts">${donut(42,"des dommages « catastrophe naturelle » indemnisés","var(--r3)")}${donut(58,"des sinistres argile depuis 1989 déclarés entre 2018 et 2022","var(--r2)")}</div>
   <p class="src">Source : ministère de la Transition écologique. Environ 240 000 sinistres entre 2018 et 2022.</p></div>
  <h2 id="n">Ce que ça change pour vous</h2>
  <p>Un sinistre moyen sur une maison coûte 16 500 €. La franchise légale, à votre charge, est de 1&nbsp;520&nbsp;€. Prévenir coûte bien moins cher : éloigner l'eau des murs, gérer les arbres proches.</p>
  ${srcBtn("https://www.ecologie.gouv.fr/politiques-publiques/sols-argileux-secheresse-construction")}`);
}
export function actuClimat(){
  return docShell(`<a href="#actualites">Actualités</a> › Analyse`, "Réchauffement : jusqu'à 8,7 millions de maisons fortement exposées à la fin du siècle", "Analyse · 3 novembre 2026 · Insee, document de travail n° 2026-18",
  [["b","En bref"],["a","Aujourd'hui"],["g","En 2100"],["p","D'ici 2050"],["n","Ce que ça change pour vous"]],
  `<div class="bref" id="b"><strong>En bref</strong><ul>
    <li>Selon l'Insee, le retrait-gonflement des argiles pourrait toucher, au moins en partie, 34 % des logements actuels.</li>
    <li>Les maisons fortement exposées passeraient de 57 000 à 1,7 million avec un réchauffement modéré, et à 8,7 millions dans le scénario le plus chaud.</li>
    <li>Ce sont les sécheresses plus fréquentes, pas l'argile elle-même, qui font monter le risque.</li></ul></div>
  <h2 id="a">Aujourd'hui : un logement sur trois</h2>
  <div class="ig rv"><h3>Sur 100 logements, 34 pourraient être touchés</h3>${housesGrid(34,"var(--r2)","34 logements sur 100 exposés au retrait-gonflement des argiles")}<p class="src">Source : Insee, 2026. Sur l'ensemble des logements : les appartements sont comptés comme non exposés, les immeubles ayant des fondations plus profondes.</p></div>
  <h2 id="g">En 2100 : maisons fortement exposées</h2>
  <div class="ig rv">${barsH([["Aujourd'hui (2005-2034)",0.057,"57 000","var(--accent-2)"],["2071-2100, réchauffement modéré",1.7,"1,7 million","var(--r2)"],["2071-2100, scénario le plus chaud",8.7,"8,7 millions","var(--r3)"]],8.7)}
   <p class="src">Source : Insee, document de travail 2026-18, tableau 3 (BRGM, Météo-France ; parc de logements 2017). Scénario modéré : RCP 4.5, environ +2,7 °C en fin de siècle ; scénario le plus chaud : RCP 8.5, environ +5 °C.</p></div>
  <p class="note">À savoir : le niveau « fort » de l'Insee croise le type de sol et le nombre de sécheresses attendues. Il ne correspond pas à la zone « forte » de la carte officielle, qui compte bien plus de maisons. Et l'Insee précise que le scénario le plus chaud est aujourd'hui jugé peu plausible ; il sert de repère pour un réchauffement élevé.</p>
  <p class="note">Nuance : ces projections décrivent l'exposition du sol, pas des fissures certaines. Une maison bien fondée et bien entretenue peut traverser ces sécheresses sans dommage.</p>
  <h2 id="p">D'ici 2050</h2>
  <div class="ig rv"><h3>Hausse des sinistres argile prévue par la CCR</h3>
   <svg class="chart" viewBox="0 0 640 90" role="img" aria-label="De plus 44 % à plus 162 % d'ici 2050">
    <line x1="20" y1="45" x2="620" y2="45" stroke="var(--line)" stroke-width="10" stroke-linecap="round"/>
    <line class="grow" x1="${20+44*3.4}" y1="45" x2="${20+162*3.4}" y2="45" stroke="var(--r2)" stroke-width="10" stroke-linecap="round"/>
    <text class="lab" x="${20+44*3.4}" y="24" text-anchor="middle">+ 44 %</text><text class="lab" x="${20+162*3.4}" y="24" text-anchor="middle">+ 162 %</text>
    <text x="20" y="78">aujourd'hui</text><text x="620" y="78" text-anchor="end">2050</text></svg>
   <p class="src">Source : Caisse centrale de réassurance, citée par le Fonds prévention argile.</p></div>
  <h2 id="n">Ce que ça change pour vous</h2>
  <p>Une maison classée aujourd'hui en risque faible peut devenir plus exposée dans vingt ans. Les gestes de prévention se font maintenant, avant les premières fissures.</p>
  ${srcBtn("https://www.insee.fr/fr/statistiques/9119400")}`);
}
export function actuRecherches(){
  return docShell(`<a href="#actualites">Actualités</a> › Analyse`, "Les recherches « fissure maison » font plus que doubler à la fin de l'été", "Analyse · Google Trends, France, du 9 novembre 2025 au 8 novembre 2026",
  [["b","En bref"],["c","Semaine par semaine"],["n","Ce que ça change pour vous"]],
  `<div class="bref" id="b"><strong>En bref</strong><ul>
    <li>L'intérêt pour « fissure maison » passe d'un indice moyen de 32 en hiver à 84 en août et septembre.</li>
    <li>Le pic est atteint la semaine du 20 septembre 2026.</li>
    <li>Les fissures apparaissent souvent pendant ou juste après les sécheresses d'été : c'est là qu'on les remarque.</li></ul></div>
  <h2 id="c">Semaine par semaine</h2>
  <div class="ig rv"><h3>Intérêt pour « fissure maison » (100 = semaine la plus haute)</h3>${trendsChart()}
   <div class="statstrip three" style="margin-top:20px">
     <div class="stat"><div class="big num" data-count="32">32</div><span>moyenne décembre-février</span></div>
     <div class="stat" style="border-color:var(--r3)"><div class="big num" data-count="84">84</div><span>moyenne août-septembre</span></div>
     <div class="stat" style="border-color:var(--accent-2)"><div class="big num" data-count="2.6" data-dec="1" data-pre="× ">× 2,6</div><span>entre l'hiver et la fin de l'été</span></div></div>
   <p class="src">Source : Google Trends, France, recherche sur le Web, relevé du 14 novembre 2026.</p></div>
  <h2 id="n">Ce que ça change pour vous</h2>
  <p>Fin d'été, regardez vos murs : fissures nouvelles, portes qui frottent. Notez la date et photographiez. Si votre commune demande la reconnaissance de catastrophe naturelle, ces preuves compteront.</p>`);
}
export function actuCarte(){
  return docShell(`<a href="#actualites">Actualités</a> › Actualité`, "Nouvelle carte des argiles : 12,1 millions de maisons concernées", "Actualité · en vigueur depuis le 1er juillet 2026",
  [["b","En bref"],["t","Le calendrier"],["g","Avant et après"],["n","Ce que ça change pour vous"]],
  `<div class="bref" id="b"><strong>En bref</strong><ul>
    <li>Un arrêté du 9 janvier 2026 met à jour la carte nationale d'exposition au retrait-gonflement des argiles.</li>
    <li>55 % du territoire hexagonal est en exposition moyenne ou forte, contre 48 % avant.</li>
    <li>12,1 millions de maisons existantes sont dans ces zones.</li></ul></div>
  <h2 id="t">Le calendrier</h2>
  <div class="ig rv"><div class="timeline"><div><b>9 janvier 2026</b>Arrêté modifiant la carte</div><div><b>31 janvier 2026</b>Publication au Journal officiel</div><div><b>1er juillet 2026</b>La nouvelle carte s'applique aux ventes de terrains et contrats de construction</div></div></div>
  <h2 id="g">Avant et après</h2>
  <div class="ig rv"><h3>Part du territoire en exposition moyenne ou forte</h3><div class="donuts">${donut(48,"Carte 2020","var(--accent-2)")}${donut(55,"Carte 2026","var(--r2)")}</div>
   <h3 style="margin-top:24px">Maisons en exposition moyenne ou forte</h3>${barsH([["Carte 2020",10.4,"10,4 millions","var(--accent-2)"],["Carte 2026",12.1,"12,1 millions","var(--r2)"]],12.1)}
   <p class="src">Sources : ministère de la Transition écologique ; SDES (2021) pour la carte 2020.</p></div>
  <h2 id="n">Ce que ça change pour vous</h2>
  <p>Si vous vendez un terrain à bâtir désormais classé en zone moyenne ou forte, vous devez fournir une étude de sol G1. Si vous faites construire, l'étude G2 et des règles de construction s'appliquent. La carte n'impose pas de travaux aux maisons déjà construites.</p>
  ${srcBtn("https://www.ecologie.gouv.fr/politiques-publiques/sols-argileux-secheresse-construction")}`);
}
export function actuFonds(){
  return docShell(`<a href="#actualites">Actualités</a> › Actualité`, "Fonds prévention argile : les conditions assouplies depuis le 1er mai", "Actualité · arrêté du 23 avril 2026, vérifié le 14 novembre 2026",
  [["b","En bref"],["t","Le calendrier"],["a","Combien l'État paie"],["d","Les 11 départements"],["n","Ce que ça change pour vous"]],
  `<div class="bref" id="b"><strong>En bref</strong><ul>
    <li>Le diagnostic est ouvert aux maisons fissurées, tant que la solidité n'est pas atteinte.</li>
    <li>Les travaux restent ouverts aux maisons dont les fissures ne dépassent pas 5 mm.</li>
    <li>Toujours 11 départements, en zone d'exposition forte, sous conditions de ressources.</li></ul></div>
  <h2 id="t">Le calendrier</h2>
  <div class="ig rv"><div class="timeline"><div><b>Octobre 2025</b>Lancement du fonds dans 11 départements</div><div><b>23 avril 2026</b>Arrêté assouplissant les conditions</div><div><b>1er mai 2026</b>Entrée en vigueur</div></div></div>
  <h2 id="a">Combien l'État paie</h2>
  <div class="ig rv"><h3>Part prise en charge pour le diagnostic</h3>
   ${barsH([["Ménage très modeste",90,"90 %","var(--accent-2)"],["Ménage modeste",85,"85 %","var(--accent)"],["Ménage intermédiaire",70,"70 %","var(--r1)"]],100)}
   <div class="grid3" style="margin-top:18px;gap:14px">
     <div class="stat"><div class="big num" data-count="2000" data-suf=" €">2 000 €</div><span>HT, plafond du diagnostic</span></div>
     <div class="stat" style="border-color:var(--accent-2)"><div class="big num" data-count="14000" data-suf=" €">14 000 €</div><span>HT, plafond des travaux</span></div>
     <div class="stat" style="border-color:var(--r1)"><div class="big num" data-count="5" data-suf=" mm">5 mm</div><span>largeur maximale des fissures pour les travaux</span></div></div>
   <p class="src">Source : arrêté du 6 septembre 2025 modifié le 23 avril 2026 (annexes 1 et 2). Diagnostic et maîtrise d'œuvre : 90/85/70 % ; travaux : 80/70/50 %.</p></div>
  <h2 id="d">Les 11 départements</h2>
  <div class="cities">${Object.entries(PILOTES).map(([c,n])=>`<span style="color:var(--ink)">${n} (${c})</span>`).join("")}</div>
  <h2 id="n">Ce que ça change pour vous</h2>
  <p>Si vous habitez l'un de ces départements, en zone forte, votre maison peut désormais être diagnostiquée même si elle a des fissures, tant que sa solidité n'est pas atteinte. <a href="#guide-fonds">Toutes les conditions</a></p>
  ${srcBtn("https://fonds-prevention-argile.beta.gouv.fr/")}`);
}


/* ================= SCHÉMAS DE FISSURES ================= */
// Cadre commun : 320 x 200, sol à y=168. Façade, sol argileux en coupe, légendes avec trait de rappel.
export let svgN=0;
export const GROUND = `<rect x="0" y="168" width="320" height="32" fill="var(--accent)" opacity=".38"/><path d="M0 168H320" stroke="var(--band-ink)" stroke-width="2"/>`;
export function bricks(x,y,w,h){const id="bk"+(++svgN);
  return `<defs><pattern id="${id}" x="${x}" y="${y}" width="36" height="16" patternUnits="userSpaceOnUse"><rect width="36" height="16" fill="var(--surface)"/><path d="M0 .75H36M0 8.75H36M18 1V8.5M1 9V16M35 9V16" stroke="var(--line)" stroke-width="1.5"/></pattern></defs><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id})" stroke="var(--band-ink)" stroke-width="2.5"/>`;}
export const enduit=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="var(--surface)" stroke="var(--band-ink)" stroke-width="2.5"/>`;
export const win=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="var(--band)" stroke="var(--band-ink)" stroke-width="2.5"/><path d="M${x+w/2} ${y}V${y+h}" stroke="var(--band-ink)" stroke-width="1.5"/>`;
export const door=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="var(--band)" stroke="var(--band-ink)" stroke-width="2.5"/><circle cx="${x+w-8}" cy="${y+h/2}" r="2.5" fill="var(--band-ink)"/>`;
export const crk=(d,w=3.4,delay=0)=>`<path d="${d}" fill="none" stroke="var(--surface)" stroke-width="${w+4}" stroke-linejoin="round" stroke-linecap="round" opacity=".9"/><path class="draw" style="--len:100;transition-delay:${delay}s" pathLength="100" d="${d}" fill="none" stroke="var(--r3)" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`;
// légende : point visé (px,py), texte en (tx,ty), ancre
export function lab(px,py,tx,ty,txt,anchor="start"){
  const w=txt.length*6.6+14, bx=anchor==="end"?tx-w:anchor==="middle"?tx-w/2:tx;
  const lx = px<bx?bx:px>bx+w?bx+w:px;
  return `<path d="M${px} ${py}L${lx} ${ty}" stroke="var(--ink)" stroke-width="1.3"/><circle cx="${px}" cy="${py}" r="3" fill="var(--ink)"/>
  <rect x="${bx}" y="${ty-11}" width="${w}" height="22" rx="11" fill="var(--ink)"/><text x="${bx+w/2}" y="${ty+4.5}" text-anchor="middle" style="font:700 12.5px var(--body);fill:var(--bg)">${txt}</text>`;
}
export const sv=inner=>`<svg viewBox="0 0 320 200" aria-hidden="true"><rect width="320" height="200" fill="var(--band)" opacity=".55"/>${inner}</svg>`;
export const arrow=(x1,y1,x2,y2,col="var(--r3)")=>{const a=Math.atan2(y2-y1,x2-x1),h=8;return `<path d="M${x1} ${y1}L${x2} ${y2}M${x2} ${y2}L${x2-h*Math.cos(a-.5)} ${y2-h*Math.sin(a-.5)}M${x2} ${y2}L${x2-h*Math.cos(a+.5)} ${y2-h*Math.sin(a+.5)}" stroke="${col}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;};

export const FISSURES = [
  {t:"Fissure en escalier", a:2, al:"À faire examiner",
   d:"Elle suit les joints des briques ou des parpaings, en diagonale, souvent depuis l'angle d'une fenêtre. Signe classique d'un mouvement des fondations.",
   svg:()=>sv(bricks(20,24,280,144)+win(54,48,62,48)+crk("M116 96 V104.75 H134 V112.75 H152 V120.75 H170 V128.75 H188 V136.75 H206 V144.75 H224 V152.75 H242 V160.75 H260 V168",3.4)+GROUND+lab(170,124,236,36,"suit les joints","middle"))},
  {t:"Fissure en biais à l'angle d'une ouverture", a:1, al:"À surveiller",
   d:"Elle part du coin d'une porte ou d'une fenêtre, en oblique. Fine et stable, on la surveille ; si elle s'ouvre, on la fait examiner.",
   svg:()=>sv(enduit(20,24,280,144)+door(66,92,46,76)+win(186,58,66,50)+crk("M112 92 L120 86 L126 78 L134 72 L140 62 L150 54",3)+crk("M186 108 L178 116 L172 126 L164 132 L158 142",3,.3)+crk("M252 58 L258 50 L266 44 L272 34",3,.5)+GROUND+lab(140,63,110,40,"part de l'angle","end"))},
  {t:"Fissure horizontale en bas de mur", a:2, al:"À faire examiner",
   d:"Elle court le long d'un joint, près du sol ou au niveau du plancher. Elle peut indiquer que le mur pivote ou s'affaisse.",
   svg:()=>sv(bricks(20,24,280,144)+win(70,46,56,44)+win(196,46,56,44)+`<path d="M20 132.75H300" stroke="var(--band-ink)" stroke-width="1" stroke-dasharray="4 4" opacity=".6"/>`+crk("M20 136.75 H98 V140.75 H186 V136.75 H300",3.4)+GROUND+lab(150,140,160,186,"le long d'un joint, près du sol","middle"))},
  {t:"Garage ou véranda qui se décolle", a:2, al:"À faire examiner",
   d:"La partie accolée penche et s'écarte de la maison : le joint s'ouvre, plus large en haut. Elle repose souvent sur des fondations moins profondes.",
   svg:()=>`<svg viewBox="0 0 320 200" aria-hidden="true"><rect width="320" height="200" fill="var(--band)" opacity=".55"/>
     <rect x="0" y="150" width="320" height="50" fill="var(--accent)" opacity=".38"/><path d="M0 150H320" stroke="var(--band-ink)" stroke-width="2"/>
     <rect x="24" y="150" width="152" height="30" fill="var(--band-ink)" opacity=".75"/>
     <path d="M24 150V66L100 22L176 66V150Z" fill="var(--surface)" stroke="var(--band-ink)" stroke-width="2.5" stroke-linejoin="round"/>
     ${win(46,82,40,32)}${door(116,96,36,54)}
     <g transform="rotate(5 300 158)"><rect x="182" y="150" width="118" height="10" fill="var(--band-ink)" opacity=".75"/><rect x="182" y="84" width="118" height="66" fill="var(--surface)" stroke="var(--band-ink)" stroke-width="2.5"/><rect x="178" y="78" width="126" height="8" fill="var(--band-ink)"/><rect x="204" y="104" width="74" height="46" fill="var(--band)" stroke="var(--band-ink)" stroke-width="2"/><path d="M204 116H278M204 128H278M204 140H278" stroke="var(--line)" stroke-width="1.5"/></g>
     <path class="draw" style="--len:100" pathLength="100" d="M177 150 L177 84" stroke="var(--r3)" stroke-width="2" stroke-dasharray="3 3" fill="none"/>
     <path d="M176 150 L176 76 L183.5 77 L182 150 Z" fill="var(--r3)" opacity=".85"/>
     ${arrow(194,70,214,58)}${lab(180,90,236,30,"le joint s'ouvre en haut","middle")}
     ${lab(100,172,6,190,"fondations profondes","start")}${lab(250,166,314,190,"fondations légères","end")}</svg>`},
  {t:"Microfissures de l'enduit", a:0, al:"Souvent esthétique",
   d:"Un fin réseau de lignes sur l'enduit, de moins de 0,2 mm, souvent en toile d'araignée. C'est en général l'enduit qui travaille, pas la structure.",
   svg:()=>{const id="cl"+(++svgN);return sv(enduit(20,24,280,144)+win(44,52,54,44)+GROUND+`<defs><clipPath id="${id}"><circle cx="210" cy="96" r="62"/></clipPath></defs>
     <circle cx="210" cy="96" r="62" fill="var(--surface)" stroke="var(--band-ink)" stroke-width="3"/>
     <g clip-path="url(#${id})"><path class="draw" style="--len:100" pathLength="100" d="M160 70 L184 84 L182 108 L206 118 M184 84 L212 76 L228 96 L252 90 M228 96 L226 124 L250 136 M182 108 L166 130 L188 146 M212 76 L216 50 M252 90 L270 104 M206 118 L226 124" fill="none" stroke="var(--r3)" stroke-width="1.6" stroke-linecap="round"/></g>
     <path d="M128 102 L210 34 M128 130 L210 158" stroke="var(--band-ink)" stroke-width="1.5" stroke-dasharray="4 4" opacity=".6"/><circle cx="128" cy="116" r="14" fill="var(--surface)" stroke="var(--band-ink)" stroke-width="2"/>`+lab(250,140,220,186,"réseau très fin, < 0,2 mm","middle"));}},
  {t:"Porte qui coince, carrelage qui se fend", a:1, al:"Signe associé",
   d:"Une porte qui frotte d'un coup, un jour irrégulier autour du battant, un carrelage fendu en ligne : la maison bouge, même sans fissure visible dehors.",
   svg:()=>sv(`<rect x="0" y="0" width="320" height="140" fill="var(--surface)"/>
     <rect x="96" y="22" width="110" height="118" fill="none" stroke="var(--band-ink)" stroke-width="6"/>
     <g transform="rotate(-2.6 100 138)"><rect x="101" y="27" width="100" height="111" fill="var(--band)" stroke="var(--band-ink)" stroke-width="2"/><circle cx="188" cy="86" r="3" fill="var(--band-ink)"/></g>
     <path d="M196 26 L203 26 L203 34" stroke="var(--r3)" stroke-width="4" fill="none" stroke-linecap="round"/>
     <path d="M103 28 L103 60" stroke="var(--r1)" stroke-width="4" stroke-linecap="round"/>
     <rect x="0" y="140" width="320" height="60" fill="var(--band)"/>
     <path d="M0 140H320M0 170H320M40 140V200M100 140V200M160 140V200M220 140V200M280 140V200" stroke="var(--line)" stroke-width="2"/>`+
     crk("M16 188 L54 178 L92 184 L132 168 L176 176 L222 158 L262 166 L306 150",2.6)+
     lab(200,30,230,28,"frotte ici","start")+lab(104,44,6,56,"jour élargi","start")+lab(176,176,314,192,"carrelage fendu","end"))}
];
export function fissureGallery(){
  return `<div class="fgal">${FISSURES.map((f,i)=>`<figure class="fcard rv" style="margin:0;transition-delay:${(i%2)*.1}s">${f.svg()}<figcaption class="fb"><span class="alert a${f.a}">${f.al}</span><h3>${f.t}</h3><p>${f.d}</p></figcaption></figure>`).join("")}</div>`;
}
export function widthScale(){
  const line=w=>`<svg viewBox="0 0 200 34" aria-hidden="true"><path d="M0 17 L40 15 L80 19 L120 14 L160 18 L200 16" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round"/></svg>`;
  return `<div class="wscale rv" role="table" aria-label="Gravité selon la largeur de la fissure">
    <div style="background:var(--r0)" role="row">${line(1)}<b>moins de 0,2 mm</b><span>Microfissure. Souvent l'enduit seul. Noter, surveiller.</span></div>
    <div style="background:var(--r1)" role="row">${line(3)}<b>0,2 à 2 mm</b><span>Fissure. Dater, mesurer, signaler à la mairie après une sécheresse.</span></div>
    <div style="background:var(--r3)" role="row">${line(7)}<b>plus de 2 mm</b><span>Lézarde, souvent traversante. Faire venir un expert.</span></div></div>`;
}
export function surveilTips(){
  return `<div class="tips">
    <div class="rv">${ico.ok}<strong>Photographier avec une règle</strong><span>Toujours au même endroit, avec la date visible.</span></div>
    <div class="rv" style="transition-delay:.1s">${ico.ok}<strong>Marquer les extrémités</strong><span>Un trait de crayon daté à chaque bout montre si la fissure s'allonge.</span></div>
    <div class="rv" style="transition-delay:.2s">${ico.ok}<strong>Regarder des deux côtés</strong><span>Une fissure visible dedans et dehors traverse le mur.</span></div></div>`;
}


/* ================= OUTILS PRATIQUES ================= */
export const fmtD = d => d.toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"});
export const parseFR = t => { const [d,m,y]=t.split("/").map(Number); return new Date(y,m-1,d); };
// --- Suivre les arrêtés sans inscription : rappel agenda + flux RSS
// --- Modèles de lettres
// --- Fissuromètre imprimable (dimensions réelles en millimètres)
export function fissuroSVG(){
  const W=170,H=62, L=[[0.1,"0,1"],[0.2,"0,2"],[0.3,"0,3"],[0.5,"0,5"],[1,"1"],[2,"2"],[3,"3"],[5,"5"]];
  const col=w=>w<0.2?"#3f8f5f":w<=2?"#c98a00":"#c0392b";
  let x=8, lines="";
  L.forEach(([w,t])=>{ lines+=`<rect x="${x}" y="10" width="${w}" height="24" fill="#111"/><text x="${x+w/2}" y="40" font-size="3.4" text-anchor="middle" font-family="sans-serif" fill="#111">${t}</text><rect x="${x-3}" y="43" width="${6+w}" height="1.6" fill="${col(w)}"/>`; x+=w+12+ (w>1?4:0); });
  let ruler=""; for(let i=0;i<=100;i++){const h=i%10===0?5:i%5===0?3.5:2; ruler+=`<line x1="${60+i}" y1="${H-4}" x2="${60+i}" y2="${H-4-h}" stroke="#111" stroke-width=".2"/>`; if(i%10===0) ruler+=`<text x="${60+i}" y="${H-10.5}" font-size="2.6" text-anchor="middle" font-family="sans-serif" fill="#111">${i/10}</text>`;}
  return `<svg class="fissuro" xmlns="http://www.w3.org/2000/svg" width="${W}mm" height="${H}mm" viewBox="0 0 ${W} ${H}" role="img" aria-label="Fissuromètre : traits de 0,1 à 5 millimètres et règle de 10 centimètres">
   <rect x=".3" y=".3" width="${W-.6}" height="${H-.6}" rx="3" fill="#fff" stroke="#111" stroke-width=".4" stroke-dasharray="2 1.5"/>
   <text x="8" y="6.5" font-size="3.6" font-weight="700" font-family="sans-serif" fill="#111">Fissuromètre · largeur en mm · argilearena.fr</text>
   ${lines}
   <text x="8" y="51" font-size="2.8" font-family="sans-serif" fill="#3f8f5f">vert : &lt; 0,2 mm, surveiller</text><text x="8" y="55" font-size="2.8" font-family="sans-serif" fill="#a36d00">jaune : 0,2 à 2 mm, dater, mesurer</text><text x="8" y="59" font-size="2.8" font-family="sans-serif" fill="#c0392b">rouge : &gt; 2 mm, expert</text>
   ${ruler}<text x="110" y="${H-14.5}" font-size="2.6" text-anchor="middle" font-family="sans-serif" fill="#111">Contrôle : cette règle doit mesurer 10 cm</text></svg>`;
}
export function pageFissuro(){
  return docShell(`<a href="#guides">Fissures : que faire ?</a> › Fissuromètre`, "Fissuromètre à imprimer : mesurez la largeur d'une fissure", "Outil gratuit · à imprimer chez vous",
   [["c","La carte à imprimer"],["u","Comment s'en servir"]],
   `<div class="bref"><strong>En bref</strong><ul><li>Imprimez la carte en taille réelle, posez-la contre la fissure et trouvez le trait de même épaisseur.</li><li>Notez la largeur et la date à chaque mesure : c'est l'évolution qui compte le plus.</li></ul></div>
   <h2 id="c">La carte à imprimer</h2>
   <div class="fissuro-wrap rv">${fissuroSVG()}</div>
   <div class="btns"><button class="btn btn-main btn-sm" type="button" id="fz-print">Imprimer</button><button class="btn btn-ghost btn-sm" type="button" id="fz-dl" style="color:var(--ink)">Télécharger (fichier à imprimer)</button></div>
   <p class="note" id="fz-msg" aria-live="polite">Imprimez à 100 % (« taille réelle »), pas « ajuster à la page ». Vérifiez ensuite que la règle mesure bien 10 cm.</p>
   <h2 id="u">Comment s'en servir</h2>
   <ol class="howto"><li><b>Posez la carte à plat</b> contre la fissure, à l'endroit le plus large.</li><li><b>Trouvez le trait qui recouvre exactement la fissure.</b> Entre deux traits, notez le plus large.</li><li><b>Photographiez</b> la carte et la fissure ensemble, avec la date.</li><li><b>Recommencez au même endroit</b> chaque mois, et surtout à la fin de l'été.</li></ol>
   ${widthScale()}
   <p class="note">Mesure indicative : la précision dépend de l'imprimante. Seul un professionnel peut dire si une fissure vient du sol. <a href="#guide-grave">Quelle fissure est grave ?</a></p>`);
}
/* ================= GUIDES ================= */
export const GUIDES = [
  {id:"guide-fissure", t:"Fissure maison : que faire ?", s:"Les bons réflexes, dans l'ordre"},
  {id:"guide-assurance", t:"Fissures et assurance : la catastrophe naturelle sécheresse", s:"Franchise de 1&nbsp;520&nbsp;€, délai de 30 jours"},
  {id:"guide-fonds", t:"Fonds prévention argile : jusqu'à 90 % d'aide", s:"11 départements, sous conditions de ressources"},
  {id:"guide-etude", t:"Étude de sol G1 et G2 : quand est-elle obligatoire ?", s:"Vente de terrain, construction, prix"},
  {id:"guide-grave", t:"Quelle fissure est grave ?", s:"Schémas : largeur, forme, emplacement"},
  {id:"lettres", t:"Modèles de lettres : mairie et assurance", s:"Préremplies, avec la date limite de déclaration"},
  {id:"fissurometre", t:"Fissuromètre à imprimer", s:"Mesurez la largeur d'une fissure, gratuitement"}
];
export const SITU=[
 {h:"guide-grave",t:"Je vois une fissure",s:"Est-elle grave ? Les schémas pour la reconnaître."},
 {h:"guide-fissure",t:"Ma maison s'est fissurée après un été sec",s:"Les démarches, dans l'ordre, pour être indemnisé."},
 {h:"guide-assurance",t:"Mon assurance va-t-elle payer ?",s:"Arrêté de catastrophe naturelle, délai, franchise."},
 {h:"guide-fonds",t:"Je veux protéger ma maison",s:"Les bons gestes, et l'aide de l'État dans 11 départements."},
 {h:"guide-etude",t:"J'achète ou je vends un terrain",s:"Quand l'étude de sol G1 est obligatoire."}];
export function routeHTML(){
  return `<div class="route rv">
    <div><span class="rn">1</span><b>Observer</b><span>Forme, largeur, dedans et dehors.</span></div>
    <div><span class="rn">2</span><b>Signaler à la mairie</b><span>Elle a 24 mois pour demander la reconnaissance.</span></div>
    <div><span class="rn">3</span><b>Déclarer à l'assureur</b><span>30 jours après l'arrêté au Journal officiel.</span></div>
    <div><span class="rn">4</span><b>L'expertise</b><span>L'expert de l'assureur, et le vôtre si besoin.</span></div>
    <div><span class="rn">5</span><b>Prévenir</b><span>Éloigner l'eau et les racines des murs.</span></div></div>`;
}
export function pageGuides(){
  return `<div class="band"><div class="wrap" style="padding-top:56px;padding-bottom:56px"><h1>Fissures : que faire ?</h1>
  <p class="lead" style="margin-top:14px;max-width:60ch">Une fissure n'est pas forcément grave, et toutes ne viennent pas du sol. Choisissez votre situation : on vous dit quoi faire, dans l'ordre.</p></div></div>
  <section class="blk tight"><div class="wrap">
    <h2 class="sec-head" style="display:block">Votre situation</h2>
    <div class="situ">${SITU.map((x,i)=>`<a class="sit rv" href="#${x.h}" style="transition-delay:${i*.06}s"><span class="fic" style="background:${G_ICONS[x.h][1]}">${G_ICONS[x.h][0]}</span><b>${x.t}</b><span>${x.s}</span><span class="fgo" aria-hidden="true">›</span></a>`).join("")}</div>
  </div></section>
  <section class="blk tight" style="padding-top:0"><div class="wrap">
    <h2 class="sec-head" style="display:block">Après une sécheresse : le parcours en 5 étapes</h2>
    ${routeHTML()}
    <div class="keyfig">
      <div class="rv"><b class="num">30 jours</b><span>pour déclarer, après l'arrêté</span></div>
      <div class="rv" style="transition-delay:.06s"><b class="num">1&nbsp;520&nbsp;€</b><span>de franchise légale</span></div>
      <div class="rv" style="transition-delay:.12s"><b class="num">24 mois</b><span>pour la demande de la mairie</span></div>
      <div class="rv" style="transition-delay:.18s"><b class="num">2 mm</b><span>au-delà : faire venir un expert</span></div></div>
    <h2 class="sec-head" style="display:block;margin-top:72px">Deux outils gratuits</h2>
    <div class="situ">${["lettres","fissurometre"].map((id,i)=>{const g=GUIDES.find(x=>x.id===id);return `<a class="sit rv" href="#${id}" style="transition-delay:${i*.06}s"><span class="fic" style="background:${G_ICONS[id][1]}">${G_ICONS[id][0]}</span><b>${g.t}</b><span>${g.s}</span><span class="fgo" aria-hidden="true">›</span></a>`}).join("")}</div>
    <p class="cta-row"><a class="btn btn-main" href="#guide-fissure">Le guide complet, étape par étape</a><button class="btn btn-ghost" type="button" data-open-search style="color:var(--ink)">Vérifier les arrêtés de ma commune</button></p>
  </div></section>`;
}
export function pageGuide(id){
  if(id==="guide-fissure") return docShell(`<a href="#guides">Fissures : que faire ?</a> › Fissure maison`, "Fissure maison : que faire ?", "Guide · vérifié le 14 novembre 2026",
   [["b","En bref"],["1","Reconnaître la fissure"],["2","Signaler à la mairie"],["3","Déclarer à l'assurance"],["4","L'expertise"],["5","Prévenir l'aggravation"],["f","Questions fréquentes"]],
   `<div class="bref" id="b"><strong>En bref</strong><ul>
     <li>Après un été sec, des fissures en escalier ou près des portes et fenêtres peuvent venir du sol argileux.</li>
     <li>L'assurance ne joue que si l'État reconnaît la sécheresse dans votre commune (arrêté de catastrophe naturelle).</li>
     <li>Vous avez alors 30 jours après la publication de l'arrêté pour déclarer le sinistre. Franchise : 1&nbsp;520&nbsp;€.</li></ul></div>
   <div class="urg"><strong>Sans attendre</strong><span>Une fissure qui s'élargit en quelques jours, un mur qui penche, une porte qui ne ferme plus du tout : faites venir un professionnel du bâtiment rapidement et prévenez votre assureur.</span></div>
   ${routeHTML()}
   <h2 id="1"><span class="sn">1</span>Reconnaître la fissure</h2><p>Toutes les fissures ne viennent pas du sol. Leur forme et leur largeur aident à faire le tri. Voici les signes les plus fréquents d'un sol argileux qui bouge.</p>
   ${fissureGallery()}
   <h3 class="sub">La largeur compte</h3>${widthScale()}
   <h3 class="sub">Suivre l'évolution</h3>${surveilTips()}
   <p><a class="btn btn-ghost btn-sm" href="#fissurometre" style="color:var(--ink)">Imprimer un fissuromètre gratuit</a></p>
   <p class="note">Ces schémas aident à décrire ce que vous voyez. Seul un professionnel peut dire si une fissure vient du sol. <a href="#guide-grave">Quelle fissure est grave ?</a></p>

   <h2 id="2"><span class="sn">2</span>Signaler à la mairie et vérifier les arrêtés</h2>
   <p>L'assurance ne paie les fissures dues à la sécheresse que si un arrêté de catastrophe naturelle couvre votre commune et la période concernée. C'est la mairie qui le demande à l'État.</p>
   <div class="scard rv"><div class="kf"><b class="num">24 mois</b><span>pour que la mairie dépose sa demande, après la sécheresse</span></div>
     <ul class="chk"><li>Cherchez votre adresse : les sécheresses déjà reconnues dans votre commune s'affichent.</li><li>Rien pour cette année ? Signalez vos fissures à la mairie, par écrit, avec des photos datées.</li><li>Plus il y a de signalements, mieux la mairie peut défendre le dossier.</li></ul>
     <p class="btns"><button class="btn btn-main btn-sm" type="button" data-open-search>Chercher mon adresse</button><a class="btn btn-ghost btn-sm" href="#lettres" style="color:var(--ink)">Modèle de lettre à la mairie</a><a class="btn btn-ghost btn-sm" href="/argile/toulouse-31555/" style="color:var(--ink)">Exemple : les 19 arrêtés de Toulouse</a></p></div>

   <h2 id="3"><span class="sn">3</span>Déclarer à votre assurance</h2>
   <p>Dès la publication de l'arrêté au Journal officiel, le délai démarre.</p>
   <div class="scard rv"><div class="kf2"><div><b class="num">30 jours</b><span>pour déclarer, après la publication de l'arrêté</span></div><div><b class="num">1&nbsp;520&nbsp;€</b><span>de franchise légale, à votre charge</span></div></div>
     <ul class="chk"><li>Écrivez à votre assureur habitation, de préférence en recommandé avec accusé de réception.</li><li>Joignez vos photos datées, vos relevés de largeur et la référence de l'arrêté.</li><li>Évitez de reboucher ou de repeindre avant le passage de l'expert : il doit voir les fissures.</li></ul>
     <p class="btns"><a class="btn btn-main btn-sm" href="#lettres" data-lt-go="assureur">Préparer ma déclaration</a><a class="btn btn-ghost btn-sm" href="#guide-assurance" style="color:var(--ink)">Fissures et assurance, en détail</a></p></div>

   <h2 id="4"><span class="sn">4</span>L'expertise</h2>
   <div class="duo rv"><div><b>L'expert de l'assureur</b><span>Mandaté et payé par votre assureur. Il constate les dommages, cherche leur cause et chiffre les réparations.</span></div>
     <div><b>Votre propre expert</b><span>Facultatif, à vos frais, sauf si votre contrat prévoit une garantie « honoraires d'expert ». Il défend vos intérêts face à l'expert de l'assureur.</span></div></div>
   <p class="note">Maison de moins de 10 ans : la garantie décennale du constructeur peut aussi s'appliquer.</p>

   <h2 id="5"><span class="sn">5</span>Prévenir l'aggravation</h2>
   <p>Les mêmes gestes limitent le risque pour toutes les maisons sur sol argileux.</p>
   <div class="actions">${[...PLAN[0].items,...PLAN[1].items].map(a=>`<div class="action rv"><div class="ico">${ico[a.i]}</div><div><h3>${a.t}</h3><p>${a.d}</p></div></div>`).join("")}</div>
   <p><a href="#accueil">Le plan d'action adapté au risque de votre adresse ›</a></p>

   <div id="f"><h2>Questions fréquentes</h2><div class="vols" style="margin-top:20px">
     ${vol("Ma commune n'a pas d'arrêté : suis-je couvert ?","<p>Non, sauf garantie particulière de votre contrat. La garantie catastrophe naturelle ne joue qu'avec un arrêté pour votre commune et la période concernée.</p>")}
     ${vol("Ma maison a moins de 10 ans","<p>La garantie décennale du constructeur peut s'appliquer. Contactez-le, ainsi que votre assurance dommages-ouvrage.</p>")}
     ${vol("Mon assurance paie-t-elle la prévention, avant les fissures ?","<p>En général, non. La garantie catastrophe naturelle ne joue qu'après des dégâts, et seulement si la sécheresse est reconnue dans votre commune. Certains assureurs proposent des conseils ou un outil d'évaluation gratuits, mais nous n'avons trouvé aucune offre qui finance les travaux de prévention. Pour ça, il y a le Fonds prévention argile, dans 11 départements.</p>")}
     ${vol("Puis-je obtenir une aide de l'État ?",`<p>Dans 11 départements, le Fonds prévention argile finance un diagnostic et des travaux de prévention. <a href="#guide-fonds">Voir les conditions</a></p>`)}
   </div></div>
   <p class="src">Sources : Code des assurances, service-public.gouv.fr, ministère de la Transition écologique.</p>`);
  if(id==="guide-fonds") return docShell(`<a href="#guides">Fissures : que faire ?</a> › Fonds prévention argile`, "Fonds prévention argile : jusqu'à 90 % d'aide", "Guide · conditions de l'arrêté du 23 avril 2026, vérifiées le 14 novembre 2026",
   [["b","En bref"],["w","Comment ça marche"],["d","Les 11 départements"],["c","Conditions"],["t","Taux et plafonds"],["s","Estimez votre aide"],["e","Où en est le fonds"]],
   `<div class="bref" id="b"><strong>En bref</strong><ul><li>L'État finance un diagnostic de vulnérabilité puis des travaux de prévention.</li><li>Pour les propriétaires occupants, en zone d'exposition forte, sous conditions de ressources.</li><li>Depuis le 1er mai 2026, une maison qui a des fissures peut faire le diagnostic, si elles ne menacent pas sa solidité ; les travaux restent réservés aux fissures de 5 mm au plus.</li></ul></div>
   <h2 id="w">Comment ça marche</h2>${fondsExplainer("00","Votre département",null).replace(/<div class="here[\s\S]*$/,"</div>")}
   <h2 id="d">Les 11 départements</h2><div class="cities">${Object.entries(PILOTES).map(([c,n])=>`<span style="color:var(--ink)">${n} (${c})</span>`).join("")}</div>
   <h2 id="c">Conditions</h2><ul><li>Résidence principale, maison non mitoyenne, 3 niveaux au plus (sous-sol compris).</li><li>Zone d'exposition forte, maison achevée depuis au moins 15 ans, assurée.</li><li>Des revenus sous les plafonds de l'Anah : au-dessus de la catégorie « intermédiaire », aucune aide.</li><li>Pas de demande d'indemnisation catastrophe naturelle en cours, et pas d'indemnisation « sécheresse » déjà reçue après le 30 juin 2025 (ni de plus de 10 000 € entre juillet 2015 et juin 2025).</li><li>Une maison sans dommage qui menace sa solidité ; pour les travaux, des fissures de 5 mm au plus.</li><li>Demandes possibles jusqu'au 31 décembre 2028.</li></ul>
   <h2 id="t">Taux et plafonds</h2><div class="tbl"><table class="t"><thead><tr><th>Ménage</th><th class="n">Diagnostic et maîtrise d'œuvre</th><th class="n">Travaux</th></tr></thead><tbody>
     <tr><td>Très modeste</td><td class="n">90 %</td><td class="n">80 %</td></tr><tr><td>Modeste</td><td class="n">85 %</td><td class="n">70 %</td></tr><tr><td>Intermédiaire</td><td class="n">70 %</td><td class="n">50 %</td></tr></tbody></table></div>
   <p>Plafonds de dépenses (HT) : 2 000 € pour le diagnostic, 1 800 € pour la maîtrise d'œuvre des travaux, 14 000 € pour les travaux, plus 1 000 € et 200 € d'accompagnement administratif facultatif. Les ménages très modestes peuvent demander une avance de 30 % sur l'aide aux travaux.</p>
   <h2 id="s">Estimez votre aide</h2>${estimHTML()}
   <details class="vol"><summary>Les plafonds de revenus 2026${pmIcon}</summary><div class="in"><div class="tbl"><table class="t"><thead><tr><th>Personnes</th><th class="n">Très modeste</th><th class="n">Modeste</th><th class="n">Intermédiaire</th></tr></thead><tbody>
   ${[1,2,3,4,5].map(n=>`<tr><td>${n}</td><td class="n">${eur(plaf("tmo",n))}</td><td class="n">${eur(plaf("mo",n))}</td><td class="n">${eur(plaf("int",n))}</td></tr>`).join("")}
   <tr><td>Par personne en plus</td><td class="n">+ ${eur(5151)}</td><td class="n">+ ${eur(6598)}</td><td class="n">+ ${eur(9357)}</td></tr></tbody></table></div>
   <p class="src" style="margin-top:8px">Revenu fiscal de référence. Barème Anah au 1er janvier 2026, hors Île-de-France.</p></div></details>
   <h2 id="e">Où en est le fonds</h2>
   <div class="ig rv"><div class="timeline">
     <div><b>6 septembre 2025</b>Décret créant le fonds, à titre expérimental</div>
     <div><b>Octobre 2025</b>Ouverture dans 11 départements choisis par l'État</div>
     <div><b>30 avril 2026</b>Près de 2 000 simulations, 218 ménages éligibles, 19 dossiers en paiement</div>
     <div><b>1er mai 2026</b>Conditions assouplies pour relancer le dispositif</div>
     <div><b>Automne 2026</b>Bilan des préfets attendu, décision sur une éventuelle extension</div></div>
     <p class="src">Sources : décret n° 2025-920, arrêté du 23 avril 2026, déclarations du ministre délégué du 11 mai 2026.</p></div>
   ${srcBtn("https://fonds-prevention-argile.beta.gouv.fr/")}`);
  if(id==="guide-grave") return docShell(`<a href="#guides">Fissures : que faire ?</a> › Quelle fissure est grave ?`, "Quelle fissure est grave ?", "Guide · avec schémas",
   [["b","En bref"],["l","La largeur"],["f","La forme"],["s","Suivre l'évolution"],["q","Quand appeler un expert"]],
   `<div class="bref" id="b"><strong>En bref</strong><ul><li>Moins de 0,2 mm : souvent l'enduit seul.</li><li>Plus de 2 mm, en escalier ou traversante : faire venir un expert.</li><li>Une fissure qui s'allonge ou s'élargit compte plus que sa taille du jour.</li></ul></div>
   <h2 id="l">La largeur</h2>${widthScale()}
   <h2 id="f">La forme</h2>${fissureGallery()}
   <h2 id="s">Suivre l'évolution</h2>${surveilTips()}<p><a class="btn btn-ghost btn-sm" href="#fissurometre" style="color:var(--ink)">Imprimer un fissuromètre gratuit</a></p>
   <h2 id="q">Quand appeler un expert</h2><ul><li>La fissure dépasse 2 mm ou traverse le mur.</li><li>Elle s'allonge ou s'élargit d'une semaine sur l'autre.</li><li>Portes et fenêtres se mettent à coincer, le carrelage se fend.</li><li>Une extension se décolle de la maison.</li></ul>
   <p><a class="btn btn-main btn-sm" href="#guide-fissure">Les démarches, étape par étape</a></p>
   <p class="note">Seuils indicatifs couramment utilisés par les professionnels du bâtiment. Seul un diagnostic sur place établit la cause.</p>`);
  if(id==="guide-assurance") return guideAssurance();
  if(id==="guide-etude") return guideEtude();
  throw new Error("Guide inconnu : "+id);
}

export function pageMethode(){
  return `<div class="band"><div class="wrap" style="padding-top:48px;padding-bottom:40px"><p class="crumbs" style="color:inherit;padding:0 0 10px"><a href="#accueil">Accueil</a> › Méthode</p><h1>Comment est calculé l'indice de risque</h1><p class="lead" style="margin-top:14px">Un indice sur 10, à partir de la carte officielle des sols, des sécheresses reconnues dans votre commune et de vos réponses.</p></div></div>
  ${blocCalcul(false)}
  <section class="blk tight"><div class="wrap prose" style="max-width:720px"><h2 style="border:0;margin:0;padding:0">Les limites</h2>
  <p>La carte décrit des formations géologiques, pas votre parcelle. Les arrêtés reflètent aussi les demandes des mairies. L'indice ne connaît ni vos fondations ni l'état de vos murs : c'est un signal pour agir, pas un diagnostic.</p></div></section>`;
}

/* ================= À PROPOS ================= */
export function pageAPropos(){
  const sources=[
    ["BRGM","Le sol","Bureau de recherches géologiques et minières","La carte d'exposition au retrait-gonflement des argiles 2026 : non exposé, faible, moyen ou fort.","Arrêté du 9 janvier 2026 · en vigueur le 1er juillet 2026","https://www.georisques.gouv.fr/"],
    ["GASPAR + JO","Les sécheresses","Base GASPAR (Géorisques) et Journal officiel (DILA)","Tous les arrêtés de catastrophe naturelle depuis 1982, commune par commune. La base GASPAR ayant plusieurs mois de retard, les arrêtés récents sont lus directement au Journal officiel, avec les communes reconnues et celles refusées.","Relu chaque semaine par le site","https://www.georisques.gouv.fr/"],
    ["INSEE","Les communes","Code officiel géographique, via l'API Découpage administratif","Le nom, les codes postaux et les limites de chaque commune, pour calculer la part du territoire exposée.","Mise à jour chaque semaine","https://geo.api.gouv.fr/"],
    ["IGN","Les adresses","Géoplateforme de l'IGN","La recherche d'adresse : votre saisie est envoyée au service public de géocodage de l'IGN pour la placer sur la carte. Nous ne la conservons pas.","Service en ligne, mis à jour en continu","https://geoservices.ign.fr/documentation/services/services-geoplateforme/geocodage"]
  ];
  const eng=[[ico.ok,"Gratuit","Toutes les pages, pour tout le monde."],[ico.lock,"Aucune adresse conservée","Nous ne conservons pas votre adresse. Aucun compte."],[ico.scale,"Un risque, pas une certitude","Nous ne disons jamais qu'une maison va se fissurer."],[ico.link,"Liens signalés","Toute mise en relation avec un professionnel sera indiquée comme telle."]];
  return `
  <div class="band about-hero"><div class="wrap">
    <p class="crumbs" style="color:inherit;padding:0 0 10px"><a href="#accueil">Accueil</a> › À propos</p>
    <h1>À propos d'Argile Arena</h1>
    <p class="lead" style="margin-top:14px">Pourquoi ce site, d'où viennent les chiffres, et ce que nous nous engageons à faire.</p>
    <div class="statstrip">
      <div class="stat rv"><div class="big num" data-count="12.1" data-dec="1" data-suf=" M">12,1 M</div><span>maisons concernées</span></div>
      <div class="stat rv" style="transition-delay:.1s"><div class="big num" data-count="55" data-suf=" %">55 %</div><span>du territoire exposé</span></div>
      <div class="stat rv" style="transition-delay:.2s"><div class="big num" data-count="4">4</div><span>sources publiques</span></div>
      <div class="stat rv" style="transition-delay:.3s"><div class="big num">0</div><span>inscription, 0 cookie</span></div>
    </div>
  </div></div>

  <section class="blk"><div class="wrap split">
    <div class="stack"><p class="kicker">Pourquoi ce site</p><p class="quote rv">L'argile ne se voit pas. Ses effets, si.</p></div>
    <div class="stack rv"><p>Plus d'une maison sur deux en France est construite sur un sol qui gonfle quand il pleut et se rétracte quand il fait sec. La plupart des propriétaires l'ignorent jusqu'à la première fissure.</p>
      <p>Les informations existent, mais elles sont dispersées : une carte ici, des arrêtés là, des aides ailleurs. Argile Arena les réunit sur une seule page par adresse, avec une réponse lisible en quelques secondes et des conseils concrets.</p>
      <p><strong>Un site indépendant.</strong> Argile Arena n'est pas un site de l'État et n'est affilié à aucun assureur. Il réutilise les données publiques, notamment celles de <a href="https://www.georisques.gouv.fr/">Géorisques</a>, le site officiel des risques : Géorisques donne les données et les documents officiels, Argile Arena explique ce qu'elles signifient pour votre maison et quoi faire.</p>
      <p>Le site fait partie de la famille Arena, avec EHPAD Arena, Scol Arena, Eau Arena et Job Arena.</p></div>
  </div></section>

  <section class="blk band"><div class="wrap">
    <div class="sec-head"><p class="kicker">D'où viennent les chiffres</p><h2>Quatre sources publiques</h2><p>Toutes réutilisées sous Licence Ouverte, recalculées chaque semaine.</p></div>
    <div class="grid2">${sources.map((s,i)=>`<div class="srccard rv" style="transition-delay:${(i%2)*.1}s"><span class="badge">${s[0]}</span><h3>${s[1]}</h3><p class="src" style="margin:0">${s[2]}</p><p>${s[3]}</p><p class="src">${s[4]} · <a href="${s[5]}">voir la source ↗</a></p></div>`).join("")}</div>
  </div></section>

  ${blocSimple()}

  <section class="blk"><div class="wrap">
    <div class="sec-head"><p class="kicker">Nos engagements</p><h2>Ce que vous pouvez attendre de nous</h2></div>
    <div class="grid4">${eng.map((e,i)=>`<div class="eng rv" style="transition-delay:${i*.08}s"><div class="ico">${e[0]}</div><h3>${e[1]}</h3><p class="note">${e[2]}</p></div>`).join("")}</div>
  </div></section>

  <section class="blk tight" style="padding-top:0"><div class="wrap split" style="align-items:start">
    <div class="ig rv"><h3>Signaler une erreur</h3><p style="margin-top:8px">Écrivez-nous en précisant l'adresse ou la commune. Nous comparons avec la source officielle et corrigeons sous quelques jours. Si l'erreur vient de la source, nous vous disons à qui vous adresser.</p><p style="margin-top:12px"><strong>contact@argilearena.fr</strong></p></div>
    <div class="stack"><h3>Les sites Arena</h3><div class="grid2 sites" style="gap:12px">
      <a href="https://ehpadarena.fr/"><strong>EHPAD Arena</strong><span class="note">Le prix des EHPAD près de chez vous</span></a>
      <a href="https://scolarena.fr/"><strong>Scol Arena</strong><span class="note">Collèges et lycées comparés</span></a>
      <a href="https://eauarena.fr/"><strong>Eau Arena</strong><span class="note">La qualité de l'eau du robinet</span></a>
      <a href="https://jobarena.org/fr/"><strong>Job Arena</strong><span class="note">Les métiers face à l'IA</span></a></div></div>
  </div></section>`;
}


/* =====================================================================
   SITE RÉEL : adresses, communes, départements, résultat, nouvelles pages
   ===================================================================== */
export const SITE = { name: "Argile Arena", url: "https://argilearena.fr", contact: "contact@argilearena.fr" };
// Renseigné par la construction (date du relevé des données)
export const META = { date: "", dateFR: "" };

export const ACTU_SLUGS = {
  "actu-secheresse-2026": "secheresse-2026-communes-reconnues",
  "actu-insee": "rechauffement-maisons-exposees-insee",
  "actu-recherches": "recherches-fissure-maison",
  "actu-cout": "cout-des-fissures-secheresse",
  "actu-carte": "nouvelle-carte-argiles-2026",
  "actu-fonds": "fonds-prevention-argile-conditions"
};
export const ROUTES = {
  "accueil": "/", "guides": "/guides/", "guide-fissure": "/fissure-maison/",
  "guide-grave": "/fissure-maison/quelle-fissure-est-grave/", "guide-assurance": "/fissure-maison/assurance/",
  "lettres": "/fissure-maison/modeles-de-lettres/", "fissurometre": "/fissure-maison/fissurometre/",
  "guide-etude": "/etude-de-sol-g1-g2/", "guide-fonds": "/aides/fonds-prevention-argile/", "aides": "/aides/",
  "actualites": "/actualites/", "methode": "/methode/", "a-propos": "/a-propos/",
  "mentions-legales": "/mentions-legales/", "confidentialite": "/confidentialite/", "communes": "/argile/",
  "ville-toulouse": "/argile/toulouse-31555/", "dep-31": "/argile/haute-garonne-31/"
};
for (const [id, slug] of Object.entries(ACTU_SLUGS)) ROUTES[id] = `/actualites/${slug}/`;
export const fixLinks = html => html.replace(/href="#([a-z0-9-]+)"/g, (m, id) => ROUTES[id] ? `href="${ROUTES[id]}"` : m);

// ---------- Formats
const MOIS = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
export const isoFR = iso => { const [y, m, d] = iso.split("-").map(Number); return `${d === 1 ? "1er" : d} ${MOIS[m - 1]} ${y}`; };
export const isoDMY = iso => iso.split("-").reverse().join("/");
export const esc = t => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export const pct = v => (Math.round(v) === v ? String(v) : String(Math.round(v))).replace(".", ",") + " %";
const plur = (n, s, p) => n + " " + (n > 1 ? (p || s + "s") : s);
// « à Toulouse », « au Mans », « aux Lilas »
export function aCommune(nom) {
  if (/^Le /.test(nom)) return "au " + nom.slice(3);
  if (/^Les /.test(nom)) return "aux " + nom.slice(4);
  return "à " + nom;
}
// « en Haute-Garonne », « dans le Nord », « dans les Landes »
const DEP_ART = { "Nord":"le","Pas-de-Calais":"le","Rhône":"le","Var":"le","Gard":"le","Gers":"le","Lot":"le","Loiret":"le","Cher":"le","Doubs":"le","Jura":"le","Tarn":"le","Cantal":"le","Calvados":"le","Finistère":"le","Morbihan":"le","Puy-de-Dôme":"le","Bas-Rhin":"le","Haut-Rhin":"le","Val-d'Oise":"le","Val-de-Marne":"le","Territoire de Belfort":"le","Lot-et-Garonne":"le","Tarn-et-Garonne":"le","Maine-et-Loire":"le","Loir-et-Cher":"le","Haute-Garonne":"la","Haute-Loire":"la","Haute-Marne":"la","Haute-Saône":"la","Haute-Savoie":"la","Haute-Vienne":"la","Haute-Corse":"la","Charente":"la","Charente-Maritime":"la","Corrèze":"la","Côte-d'Or":"la","Creuse":"la","Dordogne":"la","Drôme":"la","Gironde":"la","Loire":"la","Loire-Atlantique":"la","Lozère":"la","Manche":"la","Marne":"la","Mayenne":"la","Meurthe-et-Moselle":"la","Meuse":"la","Moselle":"la","Nièvre":"la","Sarthe":"la","Savoie":"la","Seine-Maritime":"la","Seine-et-Marne":"la","Seine-Saint-Denis":"la","Somme":"la","Vendée":"la","Vienne":"la","Corse-du-Sud":"la","Saône-et-Loire":"la","Ardèche":"l'","Ariège":"l'","Aube":"l'","Aude":"l'","Aveyron":"l'","Ain":"l'","Aisne":"l'","Allier":"l'","Ardennes":"les","Alpes-de-Haute-Provence":"les","Hautes-Alpes":"les","Alpes-Maritimes":"les","Bouches-du-Rhône":"les","Côtes-d'Armor":"les","Deux-Sèvres":"les","Hautes-Pyrénées":"les","Pyrénées-Atlantiques":"les","Pyrénées-Orientales":"les","Landes":"les","Vosges":"les","Yvelines":"les","Hauts-de-Seine":"les","Essonne":"l'","Eure":"l'","Eure-et-Loir":"l'","Hérault":"l'","Ille-et-Vilaine":"l'","Indre":"l'","Indre-et-Loire":"l'","Isère":"l'","Oise":"l'","Orne":"l'","Yonne":"l'","Paris":""};
export function enDep(nom) {
  const a = DEP_ART[nom];
  if (a === "") return "à " + nom;
  if (a === "le") return "dans le " + nom;
  if (a === "les") return "dans les " + nom;
  return "en " + nom;   // la Haute-Garonne -> en Haute-Garonne ; l'Hérault -> en Hérault
}
export const leDep = nom => { const a = DEP_ART[nom]; return a === "le" ? "Le " + nom : a === "les" ? "Les " + nom : a === "l'" ? "L'" + nom : a === "" ? nom : "La " + nom; };

// ---------- Données d'une commune (communes.json)
export const expoMain = c => c.rga[3] >= 50 ? 3 : c.rga[2] + c.rga[3] >= 50 ? (c.rga[3] > c.rga[2] ? 3 : 2) : c.rga[1] + c.rga[2] + c.rga[3] >= 50 ? 1 : 0;
export const has2026 = c => c.arretes.some(a => a[2] >= "2026-01-01");
export const refus2026 = c => (c.refus || []).find(r => r[2] >= "2026-01-01");
export const MOTIF = { m: "la sécheresse n'a pas été jugée assez exceptionnelle (critère météorologique)", g: "pas assez d'argile sensible sur la commune (critère géotechnique)", mg: "ni le critère météorologique ni le critère géotechnique ne sont remplis" };
export function refusHTML(c) {
  const R = c.refus || []; if (!R.length) return "";
  return `<div class="refus rv"><h3>${R.length > 1 ? "Demandes refusées" : "Demande refusée"}</h3><ul>${R.map(r => `<li><b>Sécheresse du ${isoDMY(r[1])} au ${isoDMY(r[2])} : non reconnue.</b> Arrêté ${r[0]}, publié au Journal officiel le ${isoFR(r[3])}.${MOTIF[r[4]] ? ` Motif : ${MOTIF[r[4]]}.` : ""}</li>`).join("")}</ul>
   <p class="note">La commune peut contester la décision devant le tribunal administratif, dans les deux mois qui suivent sa notification par le préfet. Une nouvelle demande reste possible pour une autre période.</p></div>`;
}
export const georisquesURL = c => `https://www.georisques.gouv.fr/mes-risques/connaitre-les-risques-pres-de-chez-moi/rapport2/${c.code}/${encodeURIComponent(c.nom.toUpperCase())}/commune/${(c.cp && c.cp[0]) || ""}`;

export function chartAnnees(c) {
  // Version compacte : un rectangle par année, délais d'animation portés par la feuille de style
  const y0 = 1989, y1 = 2026, W = 760, H = 160, bw = (W - 40) / (y1 - y0 + 1), on2026 = c.annees.includes(2026), r = v => Math.round(v * 10) / 10;
  let bars = "";
  for (let y = y0; y <= y1; y++) {
    const on = c.annees.includes(y), x = r(20 + (y - y0) * bw + 1), w = r(bw - 2);
    if (y === 2026 && !on) { bars += `<rect class="growy q" x="${x}" y="34" width="${w}" height="92" rx="2"/><text x="${r(x + w / 2)}" y="28" text-anchor="middle" class="qm">?</text>`; continue; }
    bars += on ? `<rect class="growy on" x="${x}" y="34" width="${w}" height="92" rx="2"/>` : `<rect class="growy" x="${x}" y="122" width="${w}" height="4" rx="2"/>`;
  }
  const ticks = [1990, 2000, 2010, 2020, 2026].map(y => `<text x="${r(20 + (y - y0) * bw + bw / 2)}" y="${H - 8}" text-anchor="middle">${y}</text>`).join("");
  const n = c.annees.filter(y => y >= y0).length;
  return `<svg class="chart yrs" viewBox="0 0 ${W} ${H}" role="img" aria-label="Années de sécheresse reconnue ${aCommune(esc(c.nom))} : ${c.annees.join(", ") || "aucune"}">${bars}<line x1="20" y1="126" x2="${W - 20}" y2="126" stroke="var(--line)"/>${ticks}<text class="lab" x="20" y="18">${plur(n, "année")} sur ${y1 - y0 + 1} couverte${n > 1 ? "s" : ""} par un arrêté sécheresse${on2026 ? "" : " · 2026 en attente"}</text></svg>`;
}
export function arretesTable(c) {
  return `<div class="tbl" style="margin-top:16px"><table class="t"><caption class="hidden">Arrêtés de catastrophe naturelle « sécheresse » ${aCommune(esc(c.nom))}</caption><thead><tr><th>Sécheresse reconnue</th><th>Publié au Journal officiel</th><th>Référence</th></tr></thead><tbody>
   ${c.arretes.map(a => `<tr><td>du ${isoDMY(a[1])} au ${isoDMY(a[2])}</td><td class="num">${isoDMY(a[3])}</td><td class="src" style="font-size:13px">${a[0]}</td></tr>`).join("")}</tbody></table></div>
   <p style="margin-top:12px"><a href="${georisquesURL(c)}">Voir la fiche officielle de la commune sur Géorisques ↗</a></p>`;
}
// Barre de répartition du territoire communal par niveau d'exposition
export function expoBar(c) {
  const lab = ["Non exposé", "Faible", "Moyen", "Fort"], col = ["var(--line)", "var(--r1)", "var(--r2)", "var(--r3)"];
  const segs = [3, 2, 1, 0].map(k => c.rga[k] > 0 ? `<div class="seg" style="width:${c.rga[k]}%;background:${col[k]}" title="${lab[k]} : ${pct(c.rga[k])}"></div>` : "").join("");
  return `<div class="expobar rv"><div class="barwrap grow" role="img" aria-label="Part du territoire : fort ${pct(c.rga[3])}, moyen ${pct(c.rga[2])}, faible ${pct(c.rga[1])}, non exposé ${pct(c.rga[0])}">${segs}</div>
   <div class="ekey">${[3, 2, 1, 0].map(k => `<span><i style="background:${col[k]}"></i>${lab[k]} <b>${pct(c.rga[k])}</b></span>`).join("")}</div></div>`;
}
export function suivreHTML(c) {
  return `<div class="suivre rv"><div><h3>Suivre les arrêtés ${aCommune(esc(c.nom))}, sans inscription</h3>
    <p>${has2026(c) ? "Un nouvel arrêté peut encore paraître." : "Un arrêté pour la sécheresse de 2026 peut paraître dans les prochains mois."} Vous aurez alors 30 jours pour déclarer vos fissures.</p></div>
    <div class="btns"><button class="btn btn-main btn-sm" type="button" data-ics="${esc(c.nom)}" data-url="/argile/${c.slug}/"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>Me rappeler de vérifier</button>
    ${c.arretes.length || (c.refus || []).length ? `<a class="btn btn-ghost btn-sm" href="/argile/${c.slug}/arretes.xml" style="color:var(--ink)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 11a8 8 0 0 1 8 8M5 5a14 14 0 0 1 14 14"/><circle cx="6" cy="18" r="1.5" fill="currentColor"/></svg>Flux RSS des arrêtés</a>` : ""}</div>
    <p class="note msg" aria-live="polite">Le rappel s'ajoute à votre agenda (tous les 3 mois, pendant 2 ans). Aucune adresse e-mail demandée.</p></div>`;
}
export function info2026Text(c) {
  const a = c.arretes.find(a => a[2] >= "2026-01-01"), r = refus2026(c), nom = aCommune(esc(c.nom));
  if (a) { const lim = new Date(a[3] + "T12:00:00Z"); lim.setUTCDate(lim.getUTCDate() + 30);
    return `La sécheresse de 2026 est reconnue ${nom} (arrêté publié au Journal officiel le ${isoFR(a[3])}). Le délai pour déclarer vos fissures à votre assureur court jusqu'au ${isoFR(lim.toISOString().slice(0, 10))}.`; }
  if (r) return `La demande de la commune pour 2026 a été refusée (arrêté publié au Journal officiel le ${isoFR(r[3])}). La commune peut contester cette décision devant le tribunal administratif.`;
  return `Aucun arrêté ne couvre encore 2026 ${nom} : la mairie a 24 mois pour déposer sa demande. Fissures récentes ? Signalez-les dès maintenant à la mairie.`;
}
const INFO2026 = c => `<div class="info rv" style="border-left:5px solid var(--r2)"><strong>Été 2026 : une sécheresse des sols historique.</strong> Selon Météo-France, les sols de France sont restés à un niveau de sécheresse record tout au long de septembre 2026. ${info2026Text(c)} <a href="#lettres">Modèle de lettre</a></div>`;

// Phrase d'introduction d'une commune
export function communeLead(c) {
  const mf = c.rga[2] + c.rga[3], n = c.arretes.length;
  let sol;
  if (c.rga[3] >= 50) sol = `${pct(c.rga[3])} du territoire est en exposition forte aux argiles`;
  else if (mf >= 50) sol = `${pct(mf)} du territoire est en exposition moyenne ou forte aux argiles`;
  else if (mf > 0) sol = `${pct(mf)} du territoire seulement est en exposition moyenne ou forte aux argiles`;
  else if (c.rga[1] > 0) sol = `le sol est surtout peu ou pas exposé aux argiles`;
  else sol = `la carte officielle ne signale pas de sol argileux exposé`;
  const sec = n ? `L'État y a reconnu la sécheresse comme catastrophe naturelle ${n === 1 ? "une fois" : n + " fois"} depuis 1989.` : `Aucune sécheresse n'y a été reconnue comme catastrophe naturelle depuis 1989.`;
  return `${aCommune(esc(c.nom)).replace(/^./, m => m.toUpperCase())}, ${sol}. ${sec}`;
}
export const communeIndexable = c => c.rga[2] + c.rga[3] >= 1 || c.arretes.length > 0 || (c.refus || []).length > 0;

export function pageCommune(c, d, voisins) {
  const n = c.arretes.length, last = c.arretes[0], mf = c.rga[2] + c.rga[3], fondsOk = !!PILOTES[c.dep];
  const nom = esc(c.nom);
  return `
  <div class="band"><div class="wrap" style="padding-bottom:44px">
    <p class="crumbs" style="color:inherit"><a href="#accueil">Accueil</a> › <a href="/argile/${d.slug}/">${esc(d.nom)}</a> › ${nom}</p>
    <h1 style="margin-top:12px">Argile ${aCommune(nom)} : risque de fissure des maisons</h1>
    <p class="lead" style="margin-top:14px">${communeLead(c)}</p>
    <p style="margin-top:22px"><button class="btn btn-main" type="button" data-open-search data-prefill="${nom} ">Tester mon adresse ${aCommune(nom)}</button></p>
  </div></div>
  <section class="blk tight"><div class="wrap stack" style="gap:64px">
    <div class="tiles">
      <div class="tile rv" style="border-top-color:var(--r3)"><div class="t">${def("Territoire exposé", DEFS.expo)}</div><div class="v num">${pct(mf)}</div><p>en exposition moyenne ou forte, dont ${pct(c.rga[3])} en forte.</p></div>
      <div class="tile rv" style="border-top-color:var(--r2);transition-delay:.1s"><div class="t">Sécheresses reconnues</div><div class="v num">${n} ${def(n > 1 ? "arrêtés" : "arrêté", DEFS.catnat)}</div><p>${last ? `Le dernier, publié le ${isoFR(last[3])}, porte sur la période du ${isoDMY(last[1])} au ${isoDMY(last[2])}.` : "Aucun depuis 1989."}</p>${n ? `<p><a href="#arretes" data-jump="arretes">Voir les arrêtés ›</a></p>` : ""}</div>
      <a class="tile rv" href="#fonds" data-jump="fonds" style="border-top-color:var(--accent-2);text-decoration:none;transition-delay:.2s"><div class="t">Aide de l'État à la prévention</div><div class="v">${fondsOk ? "Oui, sous conditions" : "Pas encore ici"}</div><p>${fondsOk ? `${leDep(esc(d.nom))} fait partie des 11 départements du Fonds prévention argile.` : `${leDep(esc(d.nom))} n'est pas dans les 11 départements du Fonds prévention argile.`}</p><p style="color:var(--link)">Comprendre ce fonds ›</p></a>
    </div>
    <div class="stack"><h2>Le sol ${aCommune(nom)}</h2>
      <p>Part du territoire de la commune dans chaque niveau de la carte officielle d'exposition aux argiles (2026).</p>
      ${expoBar(c)}
      <p class="note">Le niveau peut changer d'une rue à l'autre : seule votre adresse donne le niveau de votre maison. En exposition moyenne ou forte, une étude de sol est obligatoire pour vendre un terrain à bâtir. <a href="#guide-etude">En savoir plus</a></p>
    </div>
    ${mf >= 1 || n ? INFO2026(c) : ""}
    <div class="ig rv" id="arretes"><h3>Les sécheresses reconnues ${aCommune(nom)}</h3>${chartAnnees(c)}${n ? `<details class="vol" style="margin-top:14px"><summary>Voir ${n > 1 ? `les ${n} arrêtés` : "l'arrêté"}${pmIcon}</summary><div class="in">${arretesTable(c)}</div></details>` : `<p class="note" style="margin-top:12px">Aucun arrêté « sécheresse » depuis 1989. <a href="${georisquesURL(c)}">Fiche Géorisques ↗</a></p>`}<p class="src">Sources : base GASPAR via Géorisques et Journal officiel (arrêtés) ; carte d'exposition 2026 (BRGM), via data.gouv.fr. Données relevées le ${META.dateFR}.</p></div>
    ${refusHTML(c)}
    ${mf >= 1 || n || (c.refus || []).length ? suivreHTML(c) : ""}
    <div class="here rv" id="fonds"><strong>Le Fonds prévention argile ${fondsOk ? `: ${enDep(esc(d.nom))}, c'est possible` : `: pas encore ${enDep(esc(d.nom))}`}</strong><span>Cette aide de l'État finance un diagnostic et des travaux de prévention, de 50 % à 90 % selon les revenus, pour les maisons en exposition forte de 11 départements.${fondsOk ? " Vérifiez votre éligibilité sur le simulateur officiel." : " Le gouvernement devait décider à l'automne 2026 s'il l'étend ; aucune extension n'est annoncée à ce jour."}</span><span><a href="#guide-fonds">Conditions et montants ›</a></span></div>
    <div class="stack"><h2>Fissures : les bons réflexes</h2>
      <div class="feed">${GUIDES.filter(g => ["guide-fissure", "guide-grave", "guide-assurance", "lettres"].includes(g.id)).map(g => `<a class="fitem" href="#${g.id}"><span class="fic" style="background:${G_ICONS[g.id][1]}">${G_ICONS[g.id][0]}</span><span class="ftx"><b>${g.t}</b><small>${g.s}</small></span><span class="fgo" aria-hidden="true">›</span></a>`).join("")}</div></div>
    ${voisins.length ? `<div class="stack"><h2>Communes voisines</h2><div class="cities">${voisins.map(v => `<a href="/argile/${v.slug}/">${esc(v.nom)}</a>`).join("")}</div><p><a href="/argile/${d.slug}/">Toutes les communes ${enDep(esc(d.nom)).replace(/^en /, "de ").replace(/^dans le /, "du ").replace(/^dans les /, "des ").replace(/^à /, "de ")} ›</a></p></div>` : ""}
  </div></section>`;
}
export function communeFAQ(c) {
  const mf = c.rga[2] + c.rga[3], n = c.arretes.length, nom = c.nom;
  return [
    [`Le sol est-il argileux ${aCommune(nom)} ?`, mf ? `Selon la carte officielle de 2026, ${pct(mf)} du territoire de la commune est en exposition moyenne ou forte au retrait-gonflement des argiles, dont ${pct(c.rga[3])} en exposition forte. Le niveau exact dépend de l'adresse.` : `La carte officielle de 2026 classe la commune surtout en exposition faible ou nulle. Le niveau exact dépend de l'adresse.`],
    [`Combien de sécheresses ont été reconnues ${aCommune(nom)} ?`, n ? `L'État a reconnu la sécheresse comme catastrophe naturelle ${n === 1 ? "une fois" : n + " fois"} depuis 1989. Le dernier arrêté a été publié au Journal officiel le ${isoFR(c.arretes[0][3])}.` : `Aucun arrêté de catastrophe naturelle « sécheresse » n'a été publié pour la commune depuis 1989.`],
    [`Ma maison est fissurée ${aCommune(nom)} : que faire ?`, `Photographiez et datez les fissures, signalez-les par écrit à la mairie, qui peut demander la reconnaissance de catastrophe naturelle dans les 24 mois. Si un arrêté est publié, vous avez 30 jours pour déclarer le sinistre à votre assureur.`]
  ];
}

// ---------- Département
export function pageDepartement(d, list) {
  const tri = list.slice().sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  const fort = list.filter(c => c.rga[3] >= 50).length, mf = list.filter(c => c.rga[2] + c.rga[3] >= 50).length;
  const sec = list.filter(c => c.arretes.length).length;
  const top = list.filter(c => c.pop >= 2000).sort((a, b) => (b.rga[2] + b.rga[3] * 1.5) - (a.rga[2] + a.rga[3] * 1.5) || b.arretes.length - a.arretes.length).slice(0, 12);
  const fondsOk = !!PILOTES[d.code], nomD = esc(d.nom);
  return `
  <div class="band"><div class="wrap" style="padding-bottom:44px">
    <p class="crumbs" style="color:inherit"><a href="#accueil">Accueil</a> › <a href="/argile/">Départements</a> › ${nomD}</p>
    <h1 style="margin-top:12px">Argile ${enDep(nomD)} : risque de fissure par commune</h1>
    <p class="lead" style="margin-top:14px">${plur(mf, "commune")} sur ${list.length} ${mf > 1 ? "ont" : "a"} au moins la moitié de leur territoire en exposition moyenne ou forte aux argiles.</p>
  </div></div>
  <section class="blk tight"><div class="wrap stack" style="gap:56px">
    <div class="tiles">
      <div class="tile rv" style="border-top-color:var(--r3)"><div class="t">Communes surtout en exposition forte</div><div class="v num">${fort}</div><p>sur ${list.length} communes.</p></div>
      <div class="tile rv" style="border-top-color:var(--r2);transition-delay:.1s"><div class="t">Communes avec au moins une sécheresse reconnue</div><div class="v num">${sec}</div><p>depuis 1989.</p></div>
      <div class="tile rv" style="border-top-color:var(--accent-2);transition-delay:.2s"><div class="t">Fonds prévention argile</div><div class="v">${fondsOk ? "Oui" : "Pas encore"}</div><p><a href="#guide-fonds">Comprendre ce fonds ›</a></p></div>
    </div>
    ${top.length ? `<div class="stack"><h2>Les villes les plus exposées</h2><p class="note">Communes de plus de 2 000 habitants, classées selon la part de territoire en exposition forte puis moyenne.</p>
      <div class="tbl"><table class="t"><thead><tr><th>Commune</th><th class="n">Exposition forte</th><th class="n">Moyenne ou forte</th><th class="n">Sécheresses reconnues</th></tr></thead><tbody>
      ${top.map(c => `<tr><td><a href="/argile/${c.slug}/">${esc(c.nom)}</a></td><td class="n">${pct(c.rga[3])}</td><td class="n">${pct(c.rga[2] + c.rga[3])}</td><td class="n">${c.arretes.length}</td></tr>`).join("")}</tbody></table></div></div>` : ""}
    <div class="stack"><h2>Toutes les communes</h2>
      <div class="acwrap" style="max-width:420px"><label for="cfilter" class="hidden">Filtrer les communes</label><input id="cfilter" class="acin" autocomplete="off" placeholder="Filtrer : nom de la commune"></div>
      <ul class="clist" id="clist">${tri.map(c => `<li data-n="${esc(normz(c.nom))}"><a href="/argile/${c.slug}/">${esc(c.nom)}</a><span class="cx" style="background:${["var(--line)", "var(--r1)", "var(--r2)", "var(--r3)"][expoMain(c)]}" title="${EXPO[expoMain(c)]}"></span></li>`).join("")}</ul>
      <p class="note"><span class="cx" style="background:var(--r3)"></span> surtout forte <span class="cx" style="background:var(--r2)"></span> moyenne <span class="cx" style="background:var(--r1)"></span> faible <span class="cx" style="background:var(--line)"></span> peu ou pas exposée</p></div>
  </div></section>`;
}
export function pageDepartements(deps) {
  return `<div class="band"><div class="wrap" style="padding-top:48px;padding-bottom:48px"><p class="crumbs" style="color:inherit;padding:0 0 10px"><a href="#accueil">Accueil</a> › Départements</p><h1>Le risque argile, département par département</h1>
  <p class="lead" style="margin-top:14px">Choisissez un département pour voir ses communes, leur exposition aux argiles et les sécheresses reconnues.</p></div></div>
  <section class="blk tight"><div class="wrap"><ul class="clist deps">${deps.map(d => `<li><a href="/argile/${d.slug}/"><b>${d.code}</b> ${esc(d.nom)}</a></li>`).join("")}</ul></div></section>`;
}

// ---------- Accueil
export function pageAccueil(cities) {
  return `
  <div class="band hero"><div class="wrap">
    <div>
      <h1>Ma maison risque&#8209;t&#8209;elle de se fissurer&nbsp;?</h1>
      <p class="lead">Sur un sol argileux, la sécheresse peut fissurer les murs. Votre adresse suffit pour connaître votre risque.</p>
      <form class="search" id="searchform" role="search" action="/adresse/">
        <label for="q" class="hidden">Votre adresse</label>
        <div class="acwrap"><input id="q" name="q" class="acin" autocomplete="off" placeholder="Votre adresse ou votre commune" role="combobox" aria-expanded="false" aria-controls="q-list" aria-autocomplete="list"><button type="button" class="locbtn" id="geo" aria-label="Utiliser ma position" title="Utiliser ma position"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg></button><ul class="aclist" id="q-list" role="listbox"></ul></div>
        <button class="btn btn-main" type="submit">Voir le risque</button>
      </form>
      <div id="res" aria-live="polite"></div>
    </div>
    ${houseIll}
  </div></div>

  <section class="blk"><div class="wrap">
    <div class="sec-head"><p class="kicker">En France</p><h2>Plus d'une maison sur deux est construite sur un sol qui bouge</h2></div>
    <div class="grid3">
      <div class="card rv"><div class="big num" data-count="12.1" data-dec="1" data-suf=" millions">12,1 millions</div><p>de maisons en zone d'exposition moyenne ou forte, soit 61,5 % des maisons.</p><p class="src">Ministère de la Transition écologique, carte 2026</p></div>
      <div class="card rv" style="border-left-color:var(--accent-2);transition-delay:.1s"><div class="big num" data-count="55" data-suf=" %">55 %</div><p>du territoire en exposition moyenne ou forte, contre 48 % avec la carte précédente.</p><p class="src">Carte en vigueur depuis le 1er juillet 2026</p></div>
      <div class="card rv" style="border-left-color:var(--r3);transition-delay:.2s"><div class="big num" data-count="16500" data-suf=" €">16 500 €</div><p>coût moyen d'un sinistre « argile » sur une maison individuelle.</p><p class="src">Cour des comptes, cité par le ministère</p></div>
    </div>
  </div></section>

  ${blocSimple()}

  <section class="blk"><div class="wrap">
    <div class="sec-head"><p class="kicker">Près de chez vous</p><h2>Les grandes villes</h2></div>
    <div class="citygrid">${cities.map((c, i) => `<a href="/argile/${c.slug}/" class="city rv live" style="transition-delay:${(i % 5) * .05}s"><span class="cn">${esc(c.nom)}</span><span class="cd">${esc(c.depNom)}</span>${PILOTES[c.dep] ? `<span class="cb" style="background:var(--accent-2)">Fonds prévention argile</span>` : `<span class="cb" style="background:var(--r2)">${plur(c.arretes.length, "sécheresse reconnue", "sécheresses reconnues")}</span>`}</a>`).join("")}</div>
    <p style="margin-top:18px"><a href="/argile/">Toutes les communes, par département ›</a></p>
  </div></section>

  <section class="blk" style="padding-top:0"><div class="wrap grid2" style="gap:48px">
    <div><div class="sec-head" style="margin-bottom:20px"><h2>Fissures : que faire&nbsp;?</h2></div>
      <div class="feed">${GUIDES.slice(0, 4).map((g, i) => `<a class="fitem rv" href="#${g.id}" style="transition-delay:${i * .06}s"><span class="fic" style="background:${G_ICONS[g.id][1]}">${G_ICONS[g.id][0]}</span><span class="ftx"><b>${g.t}</b><small>${g.s}</small></span><span class="fgo" aria-hidden="true">›</span></a>`).join("")}</div>
      <p style="margin-top:16px"><a href="#guides">Tous les guides ›</a></p></div>
    <div><div class="sec-head" style="margin-bottom:20px"><h2>Actualités</h2></div>
      <div class="feed">${ACTUS.slice(0, 4).map((a, i) => `<a class="fitem rv${i === 0 ? " feat" : ""}" href="#${a.id}" style="transition-delay:${i * .06}s"><span class="ftx"><span class="tag" style="justify-self:start;background:${a.type === "Dossier" ? "var(--r2)" : a.type === "Analyse" ? "var(--accent-2)" : "var(--accent)"};color:#fff">${a.type}</span><b>${a.t}</b><small>${a.d}</small></span><span class="fgo" aria-hidden="true">›</span></a>`).join("")}</div>
      <p style="margin-top:16px"><a href="#actualites">Toutes les actualités ›</a></p></div>
  </div></section>

  <section class="blk band"><div class="wrap" style="max-width:860px">
    <div class="sec-head"><p class="kicker">Vos questions</p><h2>Questions fréquentes</h2></div>
    <div class="vols">${FAQ.map(f => vol(f[0], `<p>${f[1]}</p>${f[2] ? `<p style="margin-top:10px"><a href="#${f[2]}">${f[3]} ›</a></p>` : ""}`)).join("")}</div>
  </div></section>`;
}

// ---------- Commune : composant de recherche (dossier sécheresse, lettres)
const communePicker = (id, label) => `<div class="acwrap" style="max-width:520px"><label for="${id}" class="hidden">${label}</label><input id="${id}" class="acin" data-commune-picker autocomplete="off" placeholder="${label}" role="combobox" aria-expanded="false" aria-controls="${id}-list" aria-autocomplete="list"><ul class="aclist" id="${id}-list" role="listbox"></ul></div>`;

export function actuSecheresse2026() {
  return docShell(`<a href="#actualites">Actualités</a> › Dossier`, "Sécheresse 2026 : votre commune est-elle reconnue ?", `Dossier · liste des arrêtés mise à jour chaque semaine · données du ${META.dateFR}`,
  [["b", "En bref"], ["c", "Votre commune"], ["e", "Les étapes"], ["n", "Ce que vous pouvez faire maintenant"]],
  `<div class="bref" id="b"><strong>En bref</strong><ul>
    <li>L'été 2026 a été marqué par une sécheresse des sols historique, selon Météo-France.</li>
    <li>Pour que l'assurance couvre les fissures, l'État doit reconnaître la sécheresse commune par commune, par un arrêté publié au Journal officiel.</li>
    <li>Les mairies ont 24 mois pour déposer leur demande : la plupart des décisions sur 2026 sont encore à venir.</li></ul></div>
  <h2 id="c">Où en est votre commune ?</h2>
  <div class="ig rv">${communePicker("q3", "Votre commune")}<div id="s26" aria-live="polite"></div></div>
  <h2 id="e">Les étapes</h2>
  <div class="ig rv"><div class="timeline">
    <div><b>Été 2026</b>Sécheresse ; des fissures apparaissent ou s'aggravent.</div>
    <div><b>Jusqu'à 24 mois après</b>La mairie dépose une demande de reconnaissance auprès du préfet.</div>
    <div><b>Décision de l'État</b>Un arrêté publié au Journal officiel liste les communes reconnues et celles refusées.</div>
    <div><b>30 jours</b>Après la publication, vous avez 30 jours pour déclarer le sinistre à votre assureur.</div></div></div>
  <h2 id="n">Ce que vous pouvez faire maintenant</h2>
  <ul><li>Photographiez et datez vos fissures, avec une règle.</li><li>Signalez-les en mairie : la commune s'appuie sur ces signalements pour constituer sa demande. <a href="#lettres">Modèle de lettre</a></li><li>Gardez les factures et les preuves de dégâts.</li></ul>
  <p><a class="btn btn-main btn-sm" href="#guide-fissure">Fissure maison : que faire ?</a></p>
  <p class="src">Sources : Météo-France ; service-public.gouv.fr ; economie.gouv.fr ; base GASPAR via Géorisques. Exemple : l'arrêté du 11 septembre 2026 (Journal officiel du 22 septembre) a reconnu près de 180 communes, surtout pour des sécheresses et des inondations de 2025 et 2026.</p>`);
}

export function pageLettres() {
  return docShell(`<a href="#guides">Fissures : que faire ?</a> › Modèles de lettres`, "Lettres fissures sécheresse : mairie et assurance", "Outil gratuit · textes vérifiés sur le Code des assurances",
   [["lt", "Préparer ma lettre"], ["cm", "Comment l'envoyer"]],
   `<div class="bref"><strong>En bref</strong><ul><li>Pas encore d'arrêté pour votre commune : écrivez à la mairie pour qu'elle demande la reconnaissance de la sécheresse.</li><li>Un arrêté est paru : déclarez le sinistre à votre assureur dans les 30 jours suivant sa publication au Journal officiel.</li></ul></div>
   <h2 id="lt">Préparer ma lettre</h2>
   <div class="ltabs" role="tablist" aria-label="Destinataire"><button type="button" role="tab" data-lt="mairie" aria-selected="true">À la mairie<small>pas encore d'arrêté</small></button><button type="button" role="tab" data-lt="assureur" aria-selected="false">À mon assureur<small>un arrêté est paru</small></button></div>
   <div class="lettre">
    <form class="lform" id="lform" onsubmit="return false">
      <label>Vos nom et prénom<input name="nom" autocomplete="name" placeholder="Marie Dupont"></label>
      <label>Adresse de la maison<input name="adr" autocomplete="street-address" placeholder="12 rue des Lilas"></label>
      <label>Commune<span class="acwrap"><input name="com" id="lcom" data-commune-picker autocomplete="off" placeholder="Votre commune" role="combobox" aria-expanded="false" aria-controls="lcom-list" aria-autocomplete="list"><ul class="aclist" id="lcom-list" role="listbox"></ul></span></label>
      <label>Les fissures sont apparues<input name="quand" placeholder="à la fin de l'été 2026"></label>
      <label>Ce que vous constatez<textarea name="desc" rows="3" placeholder="fissures en escalier sur la façade sud, porte du garage qui coince"></textarea></label>
      <div class="only-mairie"><label>Année de la sécheresse<input name="annee" value="2026" inputmode="numeric"></label></div>
      <div class="only-assureur" hidden><label>Votre assureur<input name="ass" placeholder="Nom de l'assureur"></label>
        <label>Numéro de contrat<input name="contrat" placeholder="N° du contrat habitation"></label>
        <label>Arrêté concerné<select name="arr"><option value="">Choisissez d'abord votre commune</option></select></label>
        <p class="deadline" id="deadline" aria-live="polite"></p></div>
    </form>
    <div class="paper-wrap"><div class="paper" id="paper" aria-live="polite"></div>
      <div class="btns"><button class="btn btn-main btn-sm" type="button" id="l-copy">Copier le texte</button><button class="btn btn-ghost btn-sm" type="button" id="l-dl" style="color:var(--ink)">Télécharger</button><button class="btn btn-ghost btn-sm" type="button" id="l-print" style="color:var(--ink)">Imprimer</button></div>
      <p class="note" id="l-msg" aria-live="polite">Votre lettre est préparée dans votre navigateur : rien n'est envoyé ni enregistré.</p></div>
   </div>
   <h2 id="cm">Comment l'envoyer</h2>
   <ul class="chk"><li>De préférence en recommandé avec accusé de réception : vous gardez la preuve de la date d'envoi.</li><li>Joignez des photos datées des fissures, avec une règle à côté. <a href="#fissurometre">Imprimer un fissuromètre</a></li><li>Gardez une copie de tout ce que vous envoyez et recevez.</li></ul>
   <p class="note">Modèles indicatifs, à adapter à votre situation. Le délai de 30 jours est fixé par l'article L. 125-2 du Code des assurances.</p>`);
}

// ---------- Nouvelles pages éditoriales
export function guideAssurance() {
  return docShell(`<a href="#guides">Fissures : que faire ?</a> › Assurance`, "Fissures et assurance : la catastrophe naturelle sécheresse", "Guide · vérifié le 14 novembre 2026 sur service-public.gouv.fr et le Code des assurances",
  [["b", "En bref"], ["c", "La condition : un arrêté"], ["d", "Déclarer : 30 jours"], ["p", "Ce qui est couvert"], ["f", "Franchise et délais"], ["r", "Maison récente, refus, recours"]],
  `<div class="bref" id="b"><strong>En bref</strong><ul>
    <li>Les fissures dues à la sécheresse relèvent de la garantie « catastrophe naturelle », incluse dans les contrats d'assurance habitation.</li>
    <li>Elle ne joue que si l'État reconnaît la sécheresse dans votre commune, par un arrêté publié au Journal officiel.</li>
    <li>Vous avez alors 30 jours pour déclarer le sinistre. Franchise légale : 1&nbsp;520&nbsp;€.</li></ul></div>
  <h2 id="c">La condition : un arrêté de catastrophe naturelle</h2>
  <p>C'est la mairie qui demande la reconnaissance au préfet, dans un délai de 24 mois après la sécheresse. Une commission interministérielle donne son avis, puis un arrêté publié au Journal officiel liste les communes reconnues, et celles qui ne le sont pas.</p>
  <p>Sans arrêté pour votre commune et pour la bonne période, la garantie catastrophe naturelle ne s'applique pas. <a href="#actu-secheresse-2026">Où en est votre commune pour 2026 ?</a></p>
  <h2 id="d">Déclarer : 30 jours après la publication</h2>
  <div class="scard rv"><div class="kf2"><div><b class="num">30 jours</b><span>pour déclarer, après la publication de l'arrêté au Journal officiel</span></div><div><b class="num">24 mois</b><span>pour que la mairie dépose sa demande</span></div></div>
   <ul class="chk"><li>Écrivez à votre assureur habitation, de préférence en recommandé avec accusé de réception.</li><li>Joignez des photos datées des fissures, vos relevés de largeur et la référence de l'arrêté.</li><li>L'assureur mandate un expert, qui vérifie que la sécheresse est bien la cause déterminante des dommages.</li></ul>
   <p class="btns"><a class="btn btn-main btn-sm" href="#lettres">Préparer ma déclaration</a></p></div>
  <h2 id="p">Ce qui est couvert</h2>
  <p>Depuis la réforme de 2023, la garantie couvre, pour la sécheresse, les dommages qui affectent la solidité du bâti ou empêchent l'usage normal du bâtiment. Elle couvre aussi ceux qui ne le font pas encore mais sont de nature à évoluer dans ce sens. Les dommages purement esthétiques ne sont pas couverts.</p>
  <p>Quand l'expertise constate une atteinte à la solidité ou un bien devenu impropre à son usage, l'indemnisation couvre les travaux qui arrêtent les désordres.</p>
  <h2 id="f">Franchise et délais</h2>
  <div class="tbl"><table class="t"><tbody>
    <tr><td>Franchise légale, sécheresse (habitation)</td><td class="n">1&nbsp;520&nbsp;€</td></tr>
    <tr><td>Provision versée par l'assureur</td><td class="n">dans les 2 mois</td></tr>
    <tr><td>Indemnisation complète</td><td class="n">dans les 3 mois</td></tr></tbody></table></div>
  <p class="note">Les délais courent à partir de la remise de l'état estimatif des dommages, ou de la publication de l'arrêté si elle est plus tardive. Votre contrat peut prévoir mieux.</p>
  <h2 id="r">Maison récente, refus, recours</h2>
  <ul><li><b>Maison de moins de 10 ans :</b> la garantie décennale du constructeur peut s'appliquer, ainsi que l'assurance dommages-ouvrage.</li>
   <li><b>Désaccord avec l'expert :</b> vous pouvez faire appel à votre propre expert, à vos frais sauf si votre contrat prévoit une garantie « honoraires d'expert ».</li>
   <li><b>Commune non reconnue :</b> la décision de l'État peut être contestée devant le tribunal administratif ; la mairie peut aussi redéposer une demande avec de nouveaux éléments.</li></ul>
  <p class="src">Sources : service-public.gouv.fr (indemnisation des catastrophes naturelles) ; economie.gouv.fr ; Code des assurances, articles L. 125-1 et L. 125-2 ; ordonnance n° 2023-78 du 8 février 2023 et décret n° 2024-82 du 5 février 2024.</p>
  ${srcBtn("https://www.service-public.gouv.fr/particuliers/vosdroits/F3078")}`);
}
export function guideEtude() {
  return docShell(`<a href="#guides">Fissures : que faire ?</a> › Étude de sol`, "Étude de sol G1 et G2 : quand est-elle obligatoire ?", "Guide · vérifié le 14 novembre 2026",
  [["b", "En bref"], ["v", "Vendre un terrain : la G1"], ["c", "Faire construire : la G2"], ["m", "Maison existante"], ["p", "Prix et délais"]],
  `<div class="bref" id="b"><strong>En bref</strong><ul>
    <li>En zone d'exposition moyenne ou forte, le vendeur d'un terrain à bâtir doit fournir une étude de sol préalable (G1), valable 30 ans.</li>
    <li>Pour faire construire une maison dans ces zones, le constructeur suit une étude de conception (G2) ou des techniques de construction adaptées.</li>
    <li>Depuis le 1er juillet 2026, c'est la nouvelle carte qui dit si votre terrain est concerné.</li></ul></div>
  <h2 id="v">Vendre un terrain à bâtir : l'étude G1</h2>
  <p>Depuis le 1er octobre 2020 (loi Élan), le vendeur d'un terrain non bâti constructible situé en zone d'exposition moyenne ou forte fournit une étude géotechnique préalable. Elle est annexée à la promesse de vente ou, à défaut, à l'acte de vente, et reste valable 30 ans si le terrain n'a pas été remanié.</p>
  <p>Elle décrit le sol et les grands principes de construction adaptés. <button type="button" class="linkbtn" data-open-search>Votre terrain est-il en zone moyenne ou forte ?</button></p>
  <h2 id="c">Faire construire : l'étude G2</h2>
  <p>Avant de construire une maison individuelle dans ces zones, le constructeur doit soit suivre une étude géotechnique de conception, qui tient compte de l'implantation et des caractéristiques du bâtiment, soit respecter des techniques particulières de construction fixées par la réglementation. Sans étude fournie par le maître d'ouvrage, le constructeur peut la faire réaliser, avec son accord.</p>
  <h2 id="m">Maison déjà construite</h2>
  <p>Pour vendre une maison existante, la carte n'impose pas d'étude de sol. Une étude reste utile avant une extension, ou après l'apparition de fissures : c'est la base de tout diagnostic sérieux.</p>
  <h2 id="p">Prix et délais</h2>
  <p>Le prix dépend du terrain, du nombre de sondages et de la région : demandez plusieurs devis à des bureaux d'études géotechniques. Comptez souvent quelques semaines entre la commande et le rapport : mieux vaut anticiper dès la mise en vente.</p>
  <p class="src">Sources : Code de la construction et de l'habitation, articles L. 132-4 à L. 132-9 et R. 132-3 à R. 132-8 ; arrêté du 22 juillet 2020 modifié par l'arrêté du 9 janvier 2026 ; ministère de la Transition écologique.</p>
  ${srcBtn("https://www.ecologie.gouv.fr/politiques-publiques/sols-argileux-secheresse-construction")}`);
}
export function pageMentions() {
  return `<div class="wrap prose" style="max-width:760px;padding:48px 0"><p class="crumbs"><a href="#accueil">Accueil</a> › Mentions légales</p><h1>Mentions légales</h1>
  <h2>Éditeur</h2><p>Argile Arena est un site d'information gratuit, édité par un particulier à titre non professionnel. Conformément à la loi pour la confiance dans l'économie numérique, son identité a été communiquée à l'hébergeur.</p>
  <p>Contact : <a href="mailto:${SITE.contact}">${SITE.contact}</a></p>
  <h2>Hébergement</h2><p>GitHub Pages, GitHub Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis.</p>
  <h2>Données</h2><p>Les données publiques sont réutilisées sous Licence Ouverte (Etalab 2.0) : carte d'exposition au retrait-gonflement des argiles (BRGM, ministère de la Transition écologique), base GASPAR (Géorisques), découpage administratif (INSEE, geo.api.gouv.fr), géocodage (IGN, Géoplateforme). <a href="#a-propos">Nos sources</a></p>
  <h2>Responsabilité</h2><p>Les informations publiées sont indicatives. L'indice de risque ne constitue ni un diagnostic, ni un conseil juridique ou technique. Seul un professionnel, sur place, peut juger l'état d'une maison.</p></div>`;
}
export function pageConfidentialite() {
  return `<div class="wrap prose" style="max-width:760px;padding:48px 0"><p class="crumbs"><a href="#accueil">Accueil</a> › Confidentialité</p><h1>Confidentialité</h1>
  <p><strong>Aucun cookie, aucun compte, aucune adresse conservée.</strong></p>
  <h2>Votre recherche d'adresse</h2><p>Le texte que vous tapez est envoyé au service public de géocodage de l'IGN (Géoplateforme) pour trouver l'adresse sur la carte. Le résultat est calculé dans votre navigateur. Argile Arena ne reçoit ni ne conserve votre adresse.</p>
  <p>Le fond de carte et la carte des argiles sont chargés depuis les serveurs de l'IGN et de data.gouv.fr. Comme pour toute page web, ces serveurs voient l'adresse IP de votre appareil.</p>
  <h2>« Autour de moi »</h2><p>Si vous utilisez votre position, votre navigateur vous demande d'abord votre accord. La position sert seulement à retrouver l'adresse la plus proche.</p>
  <h2>Lettres, rappels, flux</h2><p>Les modèles de lettres et les rappels d'agenda sont préparés dans votre navigateur : rien n'est envoyé ni enregistré par le site.</p>
  <h2>Mesure d'audience</h2><p>Si une mesure d'audience est ajoutée, elle sera sans cookie et sans suivi d'une page à l'autre, et cette page sera mise à jour.</p>
  <p>Contact : <a href="mailto:${SITE.contact}">${SITE.contact}</a></p></div>`;
}
export function page404() {
  return `<div class="band"><div class="wrap" style="padding-top:64px;padding-bottom:64px"><h1>Page introuvable</h1><p class="lead" style="margin-top:14px">Cette adresse n'existe pas ou a changé. Cherchez une adresse ou une commune :</p>
  <p style="margin-top:22px"><button class="btn btn-main" type="button" data-open-search>Chercher une adresse</button> <a class="btn btn-ghost" href="/" style="margin-left:8px">Accueil</a></p></div></div>`;
}
// Page « adresse » : coquille remplie dans le navigateur
export function pageAdresseShell() {
  return `<div id="result"><div class="band verdict-band"><div class="wrap"><p class="crumbs" style="color:inherit"><a href="#accueil">Accueil</a> › Mon adresse</p><h1 style="margin-top:12px">Risque de fissure à votre adresse</h1><p class="lead" id="r-wait" style="margin-top:14px">Calcul en cours…</p><noscript><p class="lead">Cette page a besoin de JavaScript pour lire la carte des argiles à votre adresse.</p></noscript></div></div></div>`;
}
