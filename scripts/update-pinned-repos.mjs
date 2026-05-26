#!/usr/bin/env node
import { writeFile, readFile } from 'node:fs/promises';

const username = process.env.GITHUB_USERNAME || 'Anestxx';
const outputPath = process.env.OUTPUT_PATH || 'data/pinned-repos.json';

async function fetchPinnedRepos(user) {
  const response = await fetch(`https://github.com/${user}`, {
    headers: {
      'User-Agent': `${user}-portfolio-pins-sync`,
      Accept: 'text/html',
      'Cache-Control': 'no-cache',
    },
  });

  if (!response.ok) throw new Error(`Failed to fetch profile: ${response.status}`);
  const html = await response.text();

  const pinnedSectionStart = html.indexOf('js-pinned-items-reorder-container');
  if (pinnedSectionStart === -1) return [];

  const pinnedSection = html.slice(pinnedSectionStart, pinnedSectionStart + 120000);
  const pattern = new RegExp(`href="/${user}/([^"/]+)"`, 'g');
  const pinned = [];
  let match;

  while ((match = pattern.exec(pinnedSection)) !== null) {
    const repo = match[1];
    if (!pinned.includes(repo)) pinned.push(repo);
    if (pinned.length >= 6) break;
  }

  return pinned;
}

async function main() {
  const pinned = await fetchPinnedRepos(username);
  const payload = {
    username,
    updatedAt: new Date().toISOString(),
    repos: pinned,
  };

  let current = '';
  try {
    current = await readFile(outputPath, 'utf8');
  } catch {}

  const next = `${JSON.stringify(payload, null, 2)}\n`;
  if (current === next) {
    console.log('Pinned repos already up to date.');
    return;
  }

  await writeFile(outputPath, next, 'utf8');
  console.log(`Updated ${outputPath} with ${pinned.length} pinned repos.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
