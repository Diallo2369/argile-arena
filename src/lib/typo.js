// Typographie française : espace insécable avant ; : ! ? » et après «, hors balises, scripts et styles
export function typo(html) {
  return html.split(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>)/g).map((part, i) => {
    if (i % 2 === 1) return part;
    return part.replace(/ ([;!?»])/g, " $1").replace(/ :/g, " :").replace(/« /g, "« ");
  }).join("");
}
