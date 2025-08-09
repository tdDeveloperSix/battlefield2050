/*
  Exporter brødtekst fra i18n JSON-filer til flade .txt filer og læsbare .pdf filer.
  Kør: node scripts/export_texts.cjs
*/

const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const ROOT = process.cwd();
const LOCALES_DIR = path.join(ROOT, "src", "locales");
const OUTPUT_DA = path.join(ROOT, "content_da.txt");
const OUTPUT_EN = path.join(ROOT, "content_en.txt");
const OUTPUT_PDF_DA = path.join(ROOT, "content_da.pdf");
const OUTPUT_PDF_EN = path.join(ROOT, "content_en.pdf");

function loadJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function flatten(obj, prefix = "") {
  const lines = [];

  const helper = (value, currentPath) => {
    if (typeof value === "string") {
      lines.push({ key: currentPath, value });
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        helper(item, `${currentPath}[${index}]`);
      });
      return;
    }

    if (isPlainObject(value)) {
      for (const k of Object.keys(value)) {
        const nextPath = currentPath ? `${currentPath}.${k}` : k;
        helper(value[k], nextPath);
      }
      return;
    }
  };

  helper(obj, prefix);
  return lines;
}

function stripHtml(html) {
  if (!html) return "";
  const withNewlines = html.replace(/<br\s*\/?\s*>/gi, "\n");
  const noTags = withNewlines.replace(/<[^>]+>/g, "");
  return noTags
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function writeTxt(filePath, flatPairs, header) {
  const content = [
    `# ${header}`,
    `# Auto-genereret ${new Date().toISOString()}`,
    `# Format: sti.nøgle[optionalIndex]: værdi`,
    "",
    ...flatPairs.map(({ key, value }) => `${key}: ${stripHtml(value)}`),
    "",
  ].join("\n");
  fs.writeFileSync(filePath, content, "utf8");
}

function writePdf(filePath, title, flatPairs) {
  const doc = new PDFDocument({ margin: 50 });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.fontSize(20).text(title, { align: "left" });
  doc.moveDown();
  doc
    .fontSize(10)
    .fillColor("#666")
    .text(`Auto-generated ${new Date().toLocaleString()}`);
  doc.moveDown();
  doc.fillColor("black").fontSize(12);

  flatPairs.forEach(({ key, value }) => {
    const clean = stripHtml(value);
    doc.font("Helvetica-Bold").text(key);
    doc.moveDown(0.2);
    doc.font("Helvetica").text(clean, { paragraphGap: 8 });
    doc.moveDown();
  });

  doc.end();
}

function main() {
  const daPath = path.join(LOCALES_DIR, "da.json");
  const enPath = path.join(LOCALES_DIR, "en.json");

  if (!fs.existsSync(daPath)) {
    console.error("Mangler src/locales/da.json");
    process.exit(1);
  }
  if (!fs.existsSync(enPath)) {
    console.error("Mangler src/locales/en.json");
    process.exit(1);
  }

  const da = loadJson(daPath);
  const en = loadJson(enPath);

  const flatDa = flatten(da);
  const flatEn = flatten(en);

  writeTxt(OUTPUT_DA, flatDa, "Dansk brødtekst (content_da.txt)");
  writeTxt(OUTPUT_EN, flatEn, "Engelsk brødtekst (content_en.txt)");
  writePdf(OUTPUT_PDF_DA, "Dansk – Kamppladsens Digitale Revolution", flatDa);
  writePdf(
    OUTPUT_PDF_EN,
    "English – The Digital Revolution of the Battlefield",
    flatEn
  );

  console.log("Skrev:", OUTPUT_DA, "og", OUTPUT_EN);
  console.log("Skrev PDF:", OUTPUT_PDF_DA, "og", OUTPUT_PDF_EN);
}

main();
