// Accès au fichier PMTiles local depuis Node (lecture par plages d'octets)
import fs from "fs";
import zlib from "zlib";
import { PMTiles } from "pmtiles";
import { makeReader } from "../src/lib/rga.js";
class NodeFile {
  constructor(p) { this.p = p; this.fd = fs.openSync(p, "r"); }
  getKey() { return this.p; }
  async getBytes(o, l) { const b = Buffer.alloc(l); fs.readSync(this.fd, b, 0, l, o); return { data: b.buffer.slice(b.byteOffset, b.byteOffset + l) }; }
}
export function nodeReader(path) {
  const pm = new PMTiles(new NodeFile(path));
  return makeReader(async (z, x, y) => {
    const t = await pm.getZxy(z, x, y); if (!t) return null;
    let b = Buffer.from(t.data); if (b[0] === 0x1f && b[1] === 0x8b) b = zlib.gunzipSync(b);
    return new Uint8Array(b);
  });
}
