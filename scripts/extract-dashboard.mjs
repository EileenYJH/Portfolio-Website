import { readFileSync, writeFileSync } from 'node:fs';

const src = process.argv[2];
const out = process.argv[3] ?? 'dashboard.html';
const text = readFileSync(src, 'utf8');

const rawMatch = text.match(/R"(\w*)\(([\s\S]*?)\)\1"/);
if (rawMatch) {
  writeFileSync(out, rawMatch[2]);
  console.log(`Extracted raw literal -> ${out} (${rawMatch[2].length} bytes)`);
} else {
  const start = text.indexOf('<!DOCTYPE');
  const end = text.lastIndexOf('</html>');
  if (start === -1 || end === -1) throw new Error('No HTML payload found - inspect the header manually.');
  writeFileSync(out, text.slice(start, end + 7));
  console.log(`Extracted by tag span -> ${out}`);
}
