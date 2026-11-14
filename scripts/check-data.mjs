// Contrôle avant construction : bloque si les données sont anormales
import fs from "fs";
const fail = m => { console.error("ÉCHEC du contrôle des données : " + m); process.exit(1); };
const communes = JSON.parse(fs.readFileSync("data/site/communes.json", "utf8"));
const deps = JSON.parse(fs.readFileSync("data/site/departements.json", "utf8"));
const full = !process.argv.includes("--fixtures");
if (full && communes.length < 34000) fail(`seulement ${communes.length} communes`);
if (full && deps.length < 96) fail(`seulement ${deps.length} départements`);
const tls = communes.find(c => c.code === "31555");
if (!tls) fail("Toulouse absente");
if (tls.arretes.length < 19) fail(`Toulouse : ${tls.arretes.length} arrêtés sécheresse (19 attendus au moins)`);
if (tls.rga[2] + tls.rga[3] < 60) fail(`Toulouse : seulement ${tls.rga[2] + tls.rga[3]} % en exposition moyenne ou forte`);
const slugs = new Set();
for (const c of communes) {
  if (slugs.has(c.slug)) fail("adresse en double : " + c.slug); slugs.add(c.slug);
  if (/Ã|�/.test(c.nom)) fail("encodage : " + c.nom);
  const s = c.rga.reduce((a, b) => a + b, 0); if (Math.abs(s - 100) > 1.5) fail(`${c.nom} : parts d'exposition = ${s}`);
}
const withSec = communes.filter(c => c.arretes.length).length;
if (full && withSec < 10000) fail(`seulement ${withSec} communes avec un arrêté sécheresse`);
const expo = communes.filter(c => c.rga[2] + c.rga[3] >= 50).length / communes.length;
console.log(`Contrôle OK : ${communes.length} communes, ${deps.length} départements, ${withSec} avec sécheresse reconnue, ${Math.round(expo * 100)} % surtout en exposition moyenne ou forte.`);
