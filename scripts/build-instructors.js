const fs = require('fs');
const path = require('path');

const DP_DIR = path.join(__dirname, '..', 'assets', 'instructors', 'dp');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'instructors.json');

const DISTRICT_MAP = {
  CHE: 'Chennai',
  CBE: 'Coimbatore',
  KPM: 'Kanchipuram',
  MDI: 'Madurai',
  RIT: 'Ranipet',
  SGI: 'Sivagangai',
  TKS: 'Tenkasi',
  TVM: 'Tiruvannamalai',
  TVR: 'Tiruvallur',
  VDR: 'Virudhunagar',
};

const WTSF_RE = /^WTSF-D-([A-Z]+)-(\d{4})-(\d+)[-_](.+)\.\w+$/i;

const files = fs.readdirSync(DP_DIR);
const entries = [];
const seenIds = new Set();
let duplicates = [];
let skipped = [];

for (const f of files) {
  const match = f.match(WTSF_RE);
  if (!match) {
    skipped.push(f);
    continue;
  }

  const distCode = match[1].toUpperCase();
  const year = match[2];
  const seq = match[3].padStart(3, '0');
  const nameRaw = match[4].replace(/_/g, ' ').trim();

  const fullId = `WTSF-D-${distCode}-${year}-${seq}`;
  const district = DISTRICT_MAP[distCode];

  if (!district) {
    console.warn(`  ⚠ Unknown district code "${distCode}" for ${f}, skipping.`);
    skipped.push(f);
    continue;
  }

  if (seenIds.has(fullId)) {
    duplicates.push(fullId);
  }
  seenIds.add(fullId);

  entries.push({
    id: `${distCode.toLowerCase()}-${seq}`,
    fullId,
    name: nameRaw,
    state: 'Tamil Nadu',
    district,
    photo: `assets/instructors/dp/${f}`,
    specialization: 'Silambattam',
    experience: 0,
    bio: `${nameRaw} is the Silambam Instructor from Mudhal Aayudham`,
    social: {},
  });
}

entries.sort((a, b) => {
  if (a.district !== b.district) return a.district.localeCompare(b.district);
  return a.fullId.localeCompare(b.fullId);
});

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(entries, null, 2) + '\n', 'utf-8');

console.log(`\nDone. ${entries.length} instructors written to data/instructors.json`);
console.log(`Skipped ${skipped.length} non-matching files in dp/:`);
skipped.forEach(s => console.log(`  - ${s}`));
if (duplicates.length > 0) {
  console.log(`\n⚠ Duplicate IDs found: ${duplicates.join(', ')}`);
} else {
  console.log('\n✓ No duplicate IDs found.');
}
