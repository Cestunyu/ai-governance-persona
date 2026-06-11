import fs from "node:fs/promises";
import path from "node:path";
import QRCode from "qrcode";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "../..");
const outDir = import.meta.dirname;
const avatarPath = path.join(root, "assets/profile-pictures/gpuc-wojak.png");
const avatarDataUrl = `data:image/png;base64,${await fs.readFile(avatarPath, "base64")}`;

const width = 720;
const height = 1280;
const qrUrls = {
  zh: "https://ai-persona-qxad5fjx.edgeone.cool/ch/",
  en: "https://ai-persona-qxad5fjx.edgeone.cool/en/"
};

const copy = {
  zh: {
    title: "AI 人格测试",
    subtitle: "我的 AI 思想光谱结果",
    code: "GPUC",
    name: "算力拜物教徒",
    nearestLabel: "最接近的人",
    nearest: "Rich Sutton",
    sentence: "你不是在做 AI 政治，你只是觉得人类知识别太把自己当回事。",
    mapTitle: "二维位置",
    mapTop: "人类中心",
    mapBottom: "智能中心",
    mapLeft: "控制",
    mapRight: "开放",
    cta: "扫码测测你的 AI 人格",
    url: "ai-persona-qxad5fjx.edgeone.cool/ch/"
  },
  en: {
    title: "AI Governance Persona",
    subtitle: "My position on the AI thought spectrum",
    code: "GPUC",
    name: "Compute Cultist",
    nearestLabel: "Closest reference",
    nearest: "Rich Sutton",
    sentence: "You are not doing AI politics; you just think human knowledge should stop overestimating itself.",
    mapTitle: "2D position",
    mapTop: "Human",
    mapBottom: "Intel.",
    mapLeft: "Control",
    mapRight: "Open",
    cta: "Scan to find your AI persona",
    url: "ai-persona-qxad5fjx.edgeone.cool/en/"
  }
};

const variants = [
  {
    id: "a-avatar-first",
    label: "A / Avatar first",
    description: "The profile picture dominates; map and QR stay deliberately small."
  },
  {
    id: "b-nearest-first",
    label: "B / Nearest person first",
    description: "The closest reference is called out directly under the profile identity."
  },
  {
    id: "c-compact-poster",
    label: "C / Compact poster",
    description: "A tighter share-card layout with the same three required elements."
  }
];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function wrapText(text, maxChars) {
  const source = String(text);
  if (source.includes(" ")) {
    const words = source.split(/\s+/);
    const lines = [];
    let line = "";
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (next.length > maxChars && line) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    if (line) lines.push(line);
    return lines;
  }
  const lines = [];
  for (let i = 0; i < source.length; i += maxChars) lines.push(source.slice(i, i + maxChars));
  return lines;
}

function textBlock(text, x, y, opts = {}) {
  const {
    maxChars = 20,
    size = 28,
    weight = 800,
    lineHeight = Math.round(size * 1.35),
    color = "#152033",
    anchor = "start",
    family = "Inter, PingFang SC, Microsoft YaHei, Arial, sans-serif"
  } = opts;
  return wrapText(text, maxChars)
    .map((line, index) => `<text x="${x}" y="${y + index * lineHeight}" text-anchor="${anchor}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${color}">${esc(line)}</text>`)
    .join("");
}

function miniMap(x, y, size, options = {}) {
  const { labels, dot = { x: 0.64, y: -0.78 }, accent = "#2458d3" } = options;
  const axis = {
    top: labels.top || labels.mapTop,
    bottom: labels.bottom || labels.mapBottom,
    left: labels.left || labels.mapLeft,
    right: labels.right || labels.mapRight
  };
  const pad = 12;
  const dotX = x + ((dot.x + 2) / 4) * size;
  const dotY = y + size - ((dot.y + 2) / 4) * size;
  return `
    <g>
      <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="14" fill="#fbfdff" stroke="#cbd7e6" stroke-width="1.5"/>
      <rect x="${x + 1}" y="${y + 1}" width="${size / 2 - 1}" height="${size - 2}" rx="13" fill="#e8f1ff"/>
      <rect x="${x + size / 2}" y="${y + 1}" width="${size / 2 - 1}" height="${size - 2}" rx="13" fill="#f7fbff"/>
      <line x1="${x + size / 2}" y1="${y + pad}" x2="${x + size / 2}" y2="${y + size - pad}" stroke="#708198" stroke-opacity=".34" stroke-width="1.5"/>
      <line x1="${x + pad}" y1="${y + size / 2}" x2="${x + size - pad}" y2="${y + size / 2}" stroke="#708198" stroke-opacity=".34" stroke-width="1.5"/>
      <text x="${x + size / 2}" y="${y + 20}" text-anchor="middle" font-family="Inter, PingFang SC, Microsoft YaHei, Arial, sans-serif" font-size="10" font-weight="800" fill="#66758a">${esc(axis.top)}</text>
      <text x="${x + size / 2}" y="${y + size - 10}" text-anchor="middle" font-family="Inter, PingFang SC, Microsoft YaHei, Arial, sans-serif" font-size="10" font-weight="800" fill="#66758a">${esc(axis.bottom)}</text>
      <text x="${x + 7}" y="${y + size / 2 + 4}" text-anchor="start" font-family="Inter, PingFang SC, Microsoft YaHei, Arial, sans-serif" font-size="9" font-weight="800" fill="#66758a">${esc(axis.left)}</text>
      <text x="${x + size - 7}" y="${y + size / 2 + 4}" text-anchor="end" font-family="Inter, PingFang SC, Microsoft YaHei, Arial, sans-serif" font-size="9" font-weight="800" fill="#66758a">${esc(axis.right)}</text>
      <circle cx="${dotX}" cy="${dotY}" r="12" fill="${accent}" stroke="#fff" stroke-width="5"/>
    </g>`;
}

function qrBlock(qrDataUrl, x, y, size, c) {
  return `
    <g>
      <rect x="${x - 10}" y="${y - 10}" width="${size + 20}" height="${size + 20}" rx="16" fill="#fff" stroke="#d7e0eb"/>
      <image href="${qrDataUrl}" x="${x}" y="${y}" width="${size}" height="${size}"/>
      <text x="${x + size / 2}" y="${y + size + 35}" text-anchor="middle" font-family="Inter, PingFang SC, Microsoft YaHei, Arial, sans-serif" font-size="17" font-weight="850" fill="#12302e">${esc(c.cta)}</text>
      <text x="${x + size / 2}" y="${y + size + 58}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="720" fill="#657386">${esc(c.url)}</text>
    </g>`;
}

function avatar(x, y, size, radius = 22) {
  const clip = `avatarClip${x}${y}${size}`;
  return `
    <defs><clipPath id="${clip}"><rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${radius}"/></clipPath></defs>
    <rect x="${x - 8}" y="${y - 8}" width="${size + 16}" height="${size + 16}" rx="${radius + 8}" fill="#ffffff" stroke="#cbd7e6"/>
    <image href="${avatarDataUrl}" x="${x}" y="${y}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clip})"/>
  `;
}

function shell(content, bg = "#edf2f7") {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="${bg}"/>
    ${content}
  </svg>`;
}

function variantA(c, qrDataUrl) {
  return shell(`
    <rect x="34" y="30" width="652" height="1220" rx="28" fill="#fff" stroke="#d8e2ee"/>
    <text x="62" y="78" font-family="Inter, PingFang SC, Microsoft YaHei, Arial, sans-serif" font-size="24" font-weight="900" fill="#122033">${esc(c.title)}</text>
    <text x="62" y="108" font-family="Inter, PingFang SC, Microsoft YaHei, Arial, sans-serif" font-size="15" font-weight="760" fill="#657386">${esc(c.subtitle)}</text>
    ${avatar(116, 142, 488, 24)}
    <rect x="112" y="660" width="496" height="66" rx="16" fill="#101a2c"/>
    <text x="360" y="704" text-anchor="middle" font-family="Inter, PingFang SC, Microsoft YaHei, Arial, sans-serif" font-size="28" font-weight="950" fill="#fff">${esc(`${c.code}: ${c.name}`)}</text>
    <rect x="62" y="756" width="596" height="144" rx="20" fill="#f7fafc" stroke="#dce5ef"/>
    ${textBlock(c.sentence, 88, 810, { maxChars: c === copy.zh ? 18 : 37, size: c === copy.zh ? 27 : 25, lineHeight: 40, weight: 900, color: "#152033" })}
    <rect x="62" y="926" width="290" height="156" rx="18" fill="#f7fbff" stroke="#dce5ef"/>
    <text x="84" y="966" font-family="Inter, PingFang SC, Microsoft YaHei, Arial, sans-serif" font-size="15" font-weight="830" fill="#657386">${esc(c.nearestLabel)}</text>
    <text x="84" y="1014" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="950" fill="#101a2c">${esc(c.nearest)}</text>
    <text x="84" y="1052" font-family="Inter, PingFang SC, Microsoft YaHei, Arial, sans-serif" font-size="15" font-weight="760" fill="#657386">${esc(c.mapTitle)} · GPUC quadrant</text>
    ${miniMap(384, 938, 118, { labels: c, accent: "#315bdc" })}
    ${qrBlock(qrDataUrl, 544, 940, 92, c)}
  `);
}

function variantB(c, qrDataUrl) {
  return shell(`
    <rect x="34" y="30" width="652" height="1220" rx="28" fill="#fff" stroke="#d8e2ee"/>
    <text x="62" y="78" font-family="Inter, PingFang SC, Microsoft YaHei, Arial, sans-serif" font-size="24" font-weight="900" fill="#122033">${esc(c.title)}</text>
    <rect x="62" y="126" width="596" height="122" rx="22" fill="#102033"/>
    <text x="86" y="172" font-family="Inter, PingFang SC, Microsoft YaHei, Arial, sans-serif" font-size="15" font-weight="850" fill="#b8c6d8">${esc(c.nearestLabel)}</text>
    <text x="86" y="218" font-family="Inter, Arial, sans-serif" font-size="41" font-weight="950" fill="#fff">${esc(c.nearest)}</text>
    ${avatar(122, 286, 476, 24)}
    <rect x="120" y="784" width="480" height="66" rx="16" fill="#fff" stroke="#cbd7e6"/>
    <text x="360" y="827" text-anchor="middle" font-family="Inter, PingFang SC, Microsoft YaHei, Arial, sans-serif" font-size="28" font-weight="950" fill="#101a2c">${esc(`${c.code}: ${c.name}`)}</text>
    <rect x="62" y="882" width="596" height="126" rx="20" fill="#f7fafc" stroke="#dce5ef"/>
    ${textBlock(c.sentence, 88, 932, { maxChars: c === copy.zh ? 19 : 42, size: c === copy.zh ? 26 : 23, lineHeight: 38, weight: 900, color: "#152033" })}
    <rect x="62" y="1040" width="188" height="146" rx="18" fill="#f7fbff" stroke="#dce5ef"/>
    <text x="84" y="1075" font-family="Inter, PingFang SC, Microsoft YaHei, Arial, sans-serif" font-size="14" font-weight="830" fill="#657386">${esc(c.mapTitle)}</text>
    ${miniMap(108, 1090, 78, { labels: c, accent: "#315bdc" })}
    ${qrBlock(qrDataUrl, 500, 1064, 98, c)}
  `);
}

function variantC(c, qrDataUrl) {
  return shell(`
    <rect x="30" y="28" width="660" height="1224" rx="30" fill="#fbfcff" stroke="#d8e2ee"/>
    <rect x="54" y="52" width="612" height="290" rx="26" fill="#111c2f"/>
    <text x="84" y="100" font-family="Inter, PingFang SC, Microsoft YaHei, Arial, sans-serif" font-size="23" font-weight="900" fill="#fff">${esc(c.title)}</text>
    <text x="84" y="132" font-family="Inter, PingFang SC, Microsoft YaHei, Arial, sans-serif" font-size="15" font-weight="760" fill="#bbc7d7">${esc(c.subtitle)}</text>
    <text x="84" y="206" font-family="Inter, PingFang SC, Microsoft YaHei, Arial, sans-serif" font-size="54" font-weight="950" fill="#fff">${esc(c.code)}</text>
    <text x="84" y="256" font-family="Inter, PingFang SC, Microsoft YaHei, Arial, sans-serif" font-size="31" font-weight="920" fill="#fff">${esc(c.name)}</text>
    ${miniMap(524, 92, 96, { labels: c, accent: "#e7f0ff" })}
    <text x="572" y="224" text-anchor="middle" font-family="Inter, PingFang SC, Microsoft YaHei, Arial, sans-serif" font-size="13" font-weight="850" fill="#bbc7d7">${esc(c.mapTitle)}</text>
    ${avatar(130, 376, 460, 24)}
    <rect x="62" y="872" width="596" height="130" rx="20" fill="#fff" stroke="#dce5ef"/>
    ${textBlock(c.sentence, 88, 925, { maxChars: c === copy.zh ? 19 : 42, size: c === copy.zh ? 26 : 23, lineHeight: 38, weight: 900, color: "#152033" })}
    <rect x="62" y="1036" width="332" height="118" rx="20" fill="#eef6ff" stroke="#d8e8fb"/>
    <text x="88" y="1075" font-family="Inter, PingFang SC, Microsoft YaHei, Arial, sans-serif" font-size="15" font-weight="830" fill="#657386">${esc(c.nearestLabel)}</text>
    <text x="88" y="1120" font-family="Inter, Arial, sans-serif" font-size="36" font-weight="950" fill="#101a2c">${esc(c.nearest)}</text>
    ${qrBlock(qrDataUrl, 514, 1040, 94, c)}
  `);
}

const renderers = {
  "a-avatar-first": variantA,
  "b-nearest-first": variantB,
  "c-compact-poster": variantC
};

await fs.mkdir(outDir, { recursive: true });

const generated = [];
for (const lang of ["zh", "en"]) {
  const qrDataUrl = await QRCode.toDataURL(qrUrls[lang], {
    margin: 1,
    width: 320,
    color: { dark: "#0f172a", light: "#ffffff" }
  });
  for (const variant of variants) {
    const svg = renderers[variant.id](copy[lang], qrDataUrl);
    const base = `gpuc-share-${lang}-${variant.id}`;
    const svgPath = path.join(outDir, `${base}.svg`);
    const pngPath = path.join(outDir, `${base}.png`);
    await fs.writeFile(svgPath, svg);
    await sharp(Buffer.from(svg)).png().toFile(pngPath);
    generated.push({ ...variant, lang, png: `${base}.png`, svg: `${base}.svg` });
  }
}

const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>GPUC Share Demo</title>
  <style>
    body { margin: 0; background: #eef2f7; color: #152033; font-family: Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", Arial, sans-serif; }
    main { width: min(1180px, calc(100vw - 28px)); margin: 0 auto; padding: 28px 0 48px; }
    h1 { margin: 0 0 8px; font-size: 28px; }
    p { margin: 0 0 22px; color: #657386; line-height: 1.6; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; align-items: start; }
    figure { margin: 0; border: 1px solid #d8e2ee; border-radius: 10px; background: white; padding: 10px; }
    img { display: block; width: 100%; border-radius: 8px; background: #edf2f7; }
    figcaption { padding: 10px 2px 2px; font-size: 13px; font-weight: 800; color: #334155; }
    small { display: block; margin-top: 4px; color: #657386; font-weight: 650; line-height: 1.45; }
  </style>
</head>
<body>
  <main>
    <h1>GPUC Share Demo</h1>
    <p>All cards keep the 2D coordinate map smaller than the profile picture, make the profile picture dominant, state the closest reference clearly, and use zh/en-specific QR codes.</p>
    <section class="grid">
      ${generated.map((item) => `<figure><img src="${item.png}" alt="${esc(item.lang)} ${esc(item.label)}"><figcaption>${esc(item.lang.toUpperCase())} ${esc(item.label)}<small>${esc(item.description)}</small></figcaption></figure>`).join("\n")}
    </section>
  </main>
</body>
</html>`;
await fs.writeFile(path.join(outDir, "index.html"), html);

console.log(generated.map((item) => path.join(outDir, item.png)).join("\n"));
