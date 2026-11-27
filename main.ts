// Hearth & Ledger — the hand-in program (Node 22, standard library only).
// It copies the site (app/) and its screenshots (screenshots/) from beside
// this file into /output, then writes /output/dossier.json with the vendored
// make.fun library, which is the summary the judge reads: the screenshots,
// the first load's files and bytes, and the site's own source.
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// The program runs twice and must write identical bytes both times, so it
// copies files as they are and lets buildDossier do the only writing. Nothing
// here reads the clock, the network, or the environment: same input files in,
// same /output bytes out, on every run.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
