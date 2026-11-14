// Flux RSS des arrêtés « sécheresse » d'une commune
import { data } from "../../../lib/data.js";
import { SITE_URL } from "../../../lib/site-config.js";
const esc = t => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const dmy = iso => iso.split("-").reverse().join("/");
export function getStaticPaths() {
  return data().communes.filter(c => c.arretes.length).map(c => ({ params: { slug: c.slug }, props: { code: c.code } }));
}
export function GET({ props }) {
  const c = data().byCode.get(props.code), url = `${SITE_URL}/argile/${c.slug}/`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>Arrêtés sécheresse – ${esc(c.nom)} – Argile Arena</title><link>${url}</link><description>Reconnaissances de l'état de catastrophe naturelle « sécheresse » pour ${esc(c.nom)} (source : base GASPAR, Géorisques).</description><language>fr</language>
${c.arretes.map(a => `<item><title>Sécheresse du ${dmy(a[1])} au ${dmy(a[2])} reconnue</title><link>${url}#arretes</link><guid isPermaLink="false">${esc(a[0])}-${c.code}</guid><pubDate>${new Date(a[3] + "T12:00:00Z").toUTCString()}</pubDate><description>Arrêté ${esc(a[0])}, publié au Journal officiel le ${dmy(a[3])}.</description></item>`).join("\n")}
</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
