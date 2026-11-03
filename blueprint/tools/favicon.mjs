// Fetch a site's favicon into its project folder and make it the folder's icon in File Explorer.
// Usage: node favicon.mjs <project-folder> [domain]
// With no domain (or if the site has none), it falls back to an icon already in the project.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const dir = resolve(process.argv[2] ?? ".");
const domain = process.argv[3]?.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");

const isPng = (b) => b.length > 24 && b.readUInt32BE(0) === 0x89504e47;
const isIco = (b) => b.length > 6 && b.readUInt32LE(0) === 0x00010000;

async function get(url) {
  try {
    const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return isPng(buf) || isIco(buf) ? buf : null;
  } catch {
    return null;
  }
}

// Largest icon first: the site's own touch icon, then Google's favicon service, then /favicon.ico.
async function fromWeb(d) {
  return (
    (await get(`https://${d}/apple-touch-icon.png`)) ??
    (await get(`https://www.google.com/s2/favicons?domain=${d}&sz=128`)) ??
    (await get(`https://${d}/favicon.ico`))
  );
}

function fromProject() {
  for (const p of ["src/app/icon.png", "src/app/favicon.ico", "public/favicon.ico", "public/apple-touch-icon.png"]) {
    const f = join(dir, p);
    if (existsSync(f)) return readFileSync(f);
  }
  return null;
}

// Wrap a PNG in a single-image ICO container so Windows can use it as a folder icon.
function pngToIco(png) {
  const w = png.readUInt32BE(16), h = png.readUInt32BE(20);
  const head = Buffer.alloc(22);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(1, 4);
  head.writeUInt8(w >= 256 ? 0 : w, 6);
  head.writeUInt8(h >= 256 ? 0 : h, 7);
  head.writeUInt16LE(1, 10);
  head.writeUInt16LE(32, 12);
  head.writeUInt32LE(png.length, 14);
  head.writeUInt32LE(22, 18);
  return Buffer.concat([head, png]);
}

const icon = (domain && (await fromWeb(domain))) ?? fromProject();
if (!icon) {
  console.log("No favicon found.");
  process.exit(1);
}

if (isPng(icon)) writeFileSync(join(dir, "favicon.png"), icon);
writeFileSync(join(dir, "favicon.ico"), isPng(icon) ? pngToIco(icon) : icon);

const ini = join(dir, "desktop.ini");
if (existsSync(ini)) execFileSync("attrib", ["-h", "-s", ini]);
writeFileSync(ini, "[.ShellClassInfo]\r\nIconResource=favicon.ico,0\r\n");
execFileSync("attrib", ["+h", "+s", ini]);
execFileSync("attrib", ["+h", join(dir, "favicon.ico")]);
execFileSync("attrib", ["+r", dir]);

console.log(`Saved favicon for ${domain ?? "project"} in ${dir}`);
