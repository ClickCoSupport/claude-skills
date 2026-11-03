// Build projects.html: one card per site folder, with its favicon, phase and last update.
// Usage: node index.mjs [projects-folder]   (defaults to ~/Documents/Claude-Websites)
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(process.argv[2] ?? join(homedir(), "Documents", "Claude-Websites"));
const skip = new Set(["_tools", "starter", "node_modules"]);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => `&${{ "&": "amp", "<": "lt", ">": "gt", '"': "quot" }[c]};`);

const projects = readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !skip.has(d.name) && !d.name.startsWith("."))
  .map((d) => {
    const dir = join(root, d.name);
    const metaFile = join(dir, "project.json");
    const meta = existsSync(metaFile) ? JSON.parse(readFileSync(metaFile, "utf8")) : {};
    const icon = ["favicon.png", "favicon.ico"].find((f) => existsSync(join(dir, f)));
    return {
      folder: d.name,
      name: meta.name ?? d.name,
      domain: meta.domain ?? (d.name.includes(".") ? d.name : ""),
      phase: meta.phase ?? "Not started",
      summary: meta.summary ?? "",
      updated: meta.updated ?? statSync(dir).mtime.toISOString().slice(0, 10),
      icon: icon ? `${encodeURIComponent(d.name)}/${icon}` : "",
      url: pathToFileURL(dir).href,
    };
  })
  .sort((a, b) => b.updated.localeCompare(a.updated));

const card = (p) => `
  <li class="card">
    <div class="icon">${p.icon ? `<img src="${p.icon}" alt="">` : `<span>${esc(p.name[0]?.toUpperCase())}</span>`}</div>
    <div class="body">
      <h2>${esc(p.name)}</h2>
      ${p.domain ? `<p class="domain">${esc(p.domain)}</p>` : ""}
      ${p.summary ? `<p class="summary">${esc(p.summary)}</p>` : ""}
      <p class="meta"><span class="phase">${esc(p.phase)}</span> Updated ${esc(p.updated)}</p>
    </div>
    <a class="open" href="${p.url}">Open folder</a>
  </li>`;

writeFileSync(
  join(root, "projects.html"),
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Website projects</title>
<style>
  :root { --bg: #f6f6f4; --card: #fff; --text: #1c1c1a; --muted: #6b6b66; --line: #e3e3de; --chip: #ecebe6; }
  @media (prefers-color-scheme: dark) { :root { --bg: #161615; --card: #1f1f1d; --text: #ededea; --muted: #a3a39d; --line: #2e2e2b; --chip: #2a2a27; } }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--text); font: 16px/1.5 system-ui, sans-serif; }
  main { max-width: 760px; margin: 0 auto; padding: 48px 16px; }
  h1 { font-size: 28px; font-weight: 600; margin: 0 0 4px; }
  .lede { color: var(--muted); margin: 0 0 32px; }
  ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
  .card { display: flex; align-items: center; gap: 16px; background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 16px; }
  .icon { flex: 0 0 48px; height: 48px; border-radius: 10px; overflow: hidden; display: grid; place-items: center; background: var(--chip); font-weight: 600; font-size: 20px; }
  .icon img { width: 100%; height: 100%; object-fit: contain; }
  .body { flex: 1; min-width: 0; }
  h2 { font-size: 17px; font-weight: 600; margin: 0; }
  .domain, .summary { margin: 0; color: var(--muted); font-size: 14px; }
  .meta { margin: 6px 0 0; color: var(--muted); font-size: 13px; }
  .phase { background: var(--chip); color: var(--text); border-radius: 6px; padding: 2px 8px; margin-right: 8px; }
  .open { flex: 0 0 auto; color: var(--text); font-size: 14px; text-decoration: none; border: 1px solid var(--line); border-radius: 8px; padding: 8px 12px; }
  .open:hover { border-color: var(--muted); }
  @media (max-width: 520px) { .card { flex-wrap: wrap; } .open { width: 100%; text-align: center; } }
</style>
</head>
<body>
<main>
  <h1>Website projects</h1>
  <p class="lede">${projects.length} site${projects.length === 1 ? "" : "s"}, most recent first. Type /blueprint in a session to pick one up.</p>
  <ul>${projects.map(card).join("")}
  </ul>
</main>
</body>
</html>
`
);
console.log(`projects.html: ${projects.length} projects`);
