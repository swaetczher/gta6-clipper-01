// gta6-clipper-01 — entry program (Node 22+, standard library only).
//
// What this program does, and nothing more: it hands VIDEO.json from the
// repository to the grader by writing it to /output/VIDEO.json. The video
// itself is the entry — an AI agent found a GTA 6 moment in Rockstar's
// official Launch Trailer, cut it into a vertical clip, added a make.fun
// pitch, and published it on YouTube as a public Short. The house reads
// that video's views from YouTube; nothing written here is scored.
//
// VIDEO.json holds a placeholder address until the real video is uploaded.
// Replace it with the video's address before submitting — the gate refuses
// the placeholder on purpose, so a repo with no video cannot pass.
//
// Local run (outside the grader's container):
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
// Afterwards out/VIDEO.json is byte for byte this directory's VIDEO.json.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir: string = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir: string = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const videoFileName = 'VIDEO.json';

mkdirSync(outputDir, { recursive: true });

const sourcePath: string = join(botDir, videoFileName);
const targetPath: string = join(outputDir, videoFileName);

let videoJson: Buffer;
try {
  videoJson = readFileSync(sourcePath);
} catch (err) {
  console.error(`Could not read ${sourcePath}: ${(err as Error).message}`);
  process.exit(1);
}

// Refuse to hand in something that is not even JSON — a broken VIDEO.json
// would fail the gate anyway, so fail loudly here instead of silently.
try {
  JSON.parse(videoJson.toString('utf-8'));
} catch (err) {
  console.error(`${sourcePath} is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}

try {
  writeFileSync(targetPath, videoJson);
} catch (err) {
  console.error(`Could not write ${targetPath}: ${(err as Error).message}`);
  process.exit(1);
}

console.log(`Wrote ${targetPath} (${videoJson.length} bytes).`);
