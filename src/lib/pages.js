// Registre des pages éditoriales : adresse, titre, description, rendu, données structurées
import * as C from "./core.js";

const T = t => `${t} | Argile Arena`;
export const crumbs = (...items) => ({ "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [["Accueil", "/"], ...items].map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: C.SITE.url + url })) });
export const faqLD = list => ({ "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: list.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ") } })) });
const article = (headline, url, date, type = "Article") => ({ "@context": "https://schema.org", "@type": type, headline, inLanguage: "fr",
  datePublished: date, dateModified: date, mainEntityOfPage: C.SITE.url + url, publisher: { "@type": "Organization", name: "Argile Arena", url: C.SITE.url } });

const ACTU_DATES = { "actu-secheresse-2026": "2026-11-14", "actu-insee": "2026-11-04", "actu-recherches": "2026-11-14", "actu-cout": "2026-11-14", "actu-carte": "2026-07-01", "actu-fonds": "2026-05-01" };
const ACTU_DESC = {
  "actu-secheresse-2026": "La sécheresse de 2026 est-elle reconnue dans votre commune ? Arrêtés de catastrophe naturelle, délais, démarches.",
  "actu-insee": "Selon l'Insee, le nombre de maisons fortement exposées aux argiles pourrait passer de 57 000 à 1,7 million, voire 8,7 millions d'ici la fin du siècle.",
  "actu-recherches": "Les recherches « fissure maison » font plus que doubler à la fin de l'été : ce que montre Google Trends.",
  "actu-cout": "Le coût des sinistres liés aux argiles est passé d'environ 375 millions à 1,5 milliard d'euros par an.",
  "actu-carte": "La nouvelle carte d'exposition aux argiles, en vigueur depuis le 1er juillet 2026 : 55 % du territoire et 12,1 millions de maisons en zone moyenne ou forte.",
  "actu-fonds": "Fonds prévention argile : ce qui a changé avec l'arrêté du 23 avril 2026."
};

export function editorialPages() {
  const R = C.ROUTES, P = [];
  const add = (id, title, desc, render, ld = []) => P.push({ id, path: R[id], title: T(title), desc, render, ld });
  const G = id => C.GUIDES.find(g => g.id === id);
  add("guides", "Fissures : que faire ? Guides et outils", "Fissure maison : la reconnaître, la mesurer, la signaler à la mairie, la déclarer à l'assurance. Guides et outils gratuits.", C.pageGuides, [crumbs(["Fissures : que faire ?", R.guides])]);
  add("guide-fissure", "Fissure maison : que faire ? Les démarches dans l'ordre", "Fissure sur votre maison après un été sec : reconnaître la fissure, signaler à la mairie, déclarer à l'assurance dans les 30 jours, expertise, prévention.", () => C.pageGuide("guide-fissure"),
    [crumbs(["Fissures : que faire ?", R.guides], ["Fissure maison", R["guide-fissure"]]), article("Fissure maison : que faire ?", R["guide-fissure"], "2026-11-14")]);
  add("guide-grave", "Quelle fissure est grave ? Largeur, forme, schémas", "Fissure en escalier, horizontale, traversante : comment savoir si une fissure est grave. Schémas, largeurs, quand appeler un expert.", () => C.pageGuide("guide-grave"),
    [crumbs(["Fissures : que faire ?", R.guides], ["Quelle fissure est grave ?", R["guide-grave"]]), article("Quelle fissure est grave ?", R["guide-grave"], "2026-11-14")]);
  add("guide-assurance", "Fissures et assurance : catastrophe naturelle sécheresse", "Fissures dues à la sécheresse : arrêté de catastrophe naturelle, déclaration dans les 30 jours, franchise de 1 520 €, délais d'indemnisation.", () => C.pageGuide("guide-assurance"),
    [crumbs(["Fissures : que faire ?", R.guides], ["Assurance", R["guide-assurance"]]), article(G("guide-assurance").t, R["guide-assurance"], "2026-11-14")]);
  add("lettres", "Lettres fissures sécheresse : modèles pour la mairie et l'assurance", "Modèles de lettres gratuits : demande de reconnaissance de catastrophe naturelle à la mairie, déclaration de sinistre sécheresse à l'assureur, avec la date limite.", C.pageLettres,
    [crumbs(["Fissures : que faire ?", R.guides], ["Modèles de lettres", R.lettres])]);
  add("fissurometre", "Fissuromètre à imprimer : mesurez une fissure", "Fissuromètre gratuit à imprimer : traits de 0,1 à 5 mm et règle de contrôle, pour mesurer et suivre la largeur d'une fissure.", C.pageFissuro,
    [crumbs(["Fissures : que faire ?", R.guides], ["Fissuromètre", R.fissurometre])]);
  add("guide-etude", "Étude de sol G1 et G2 : quand est-elle obligatoire ?", "Loi Élan : étude de sol G1 obligatoire pour vendre un terrain à bâtir en zone d'exposition moyenne ou forte aux argiles, G2 pour faire construire.", () => C.pageGuide("guide-etude"),
    [crumbs(["Étude de sol G1 et G2", R["guide-etude"]]), article(G("guide-etude").t, R["guide-etude"], "2026-11-14")]);
  add("aides", "Aides et recours : fissures et argile", "Fonds prévention argile, garantie catastrophe naturelle, étude de sol : les aides et recours avant et après les fissures.", C.pageAides, [crumbs(["Aides", R.aides])]);
  add("guide-fonds", "Fonds prévention argile : conditions, montants, départements", "Fonds prévention argile : 11 départements, diagnostic et travaux aidés de 50 % à 90 % selon les revenus, plafonds et conditions de l'arrêté du 23 avril 2026.", () => C.pageGuide("guide-fonds"),
    [crumbs(["Aides", R.aides], ["Fonds prévention argile", R["guide-fonds"]]), article("Fonds prévention argile", R["guide-fonds"], "2026-11-14")]);
  add("actualites", "Actualités et analyses : argile, sécheresse, fissures", "Nouvelles règles, aides, sécheresse 2026 et analyses chiffrées sur le risque argile.", C.pageActus, [crumbs(["Actualités", R.actualites])]);
  for (const a of C.ACTUS) add(a.id, a.t, ACTU_DESC[a.id], a.body,
    [crumbs(["Actualités", R.actualites], [a.t, R[a.id]]), article(a.t, R[a.id], ACTU_DATES[a.id], a.type === "Actualité" ? "NewsArticle" : "Article")]);
  add("methode", "Méthode : comment est calculé l'indice de risque", "L'indice de risque de fissure sur 10 : sol (carte officielle 2026), sécheresses reconnues, environnement de la maison. Méthode et limites.", C.pageMethode, [crumbs(["Méthode", R.methode])]);
  add("a-propos", "À propos", "Argile Arena réunit les données publiques sur le risque de fissure des maisons : sources, engagements, contact.", C.pageAPropos, [crumbs(["À propos", R["a-propos"]])]);
  add("mentions-legales", "Mentions légales", "Mentions légales d'Argile Arena.", C.pageMentions, []);
  add("confidentialite", "Confidentialité", "Aucun cookie, aucun compte, aucune adresse conservée.", C.pageConfidentialite, []);
  return P;
}
