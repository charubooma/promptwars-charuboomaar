// push-to-github.mjs
// This script uses isomorphic-git (pure JS) to initialize a git repo
// and push all files to GitHub without needing git installed.
//
// Usage: node push-to-github.mjs YOUR_GITHUB_TOKEN

import * as git from 'isomorphic-git';
import http from 'isomorphic-git/http/node/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = __dirname;

const TOKEN = process.argv[2];
const REPO_URL = 'https://github.com/charubooma/promptwars-chennai-charuboomaar.git';
const BRANCH = 'main';
const AUTHOR_NAME = 'Charu Boomaar';
const AUTHOR_EMAIL = 'charu@promptwars.dev';

if (!TOKEN) {
  console.error('❌  Usage: node push-to-github.mjs YOUR_GITHUB_TOKEN');
  process.exit(1);
}

console.log('🔧  Initializing git repository...');
await git.init({ fs, dir, defaultBranch: BRANCH });

// Stage all files
console.log('📦  Staging all files...');
await git.add({ fs, dir, filepath: '.' });

// Commit
console.log('✅  Creating commit...');
const sha = await git.commit({
  fs,
  dir,
  message: 'Final Challenge Build',
  author: { name: AUTHOR_NAME, email: AUTHOR_EMAIL },
});
console.log(`   Commit SHA: ${sha}`);

// Push to GitHub
console.log(`🚀  Pushing to ${REPO_URL} (branch: ${BRANCH})...`);
const result = await git.push({
  fs,
  http,
  dir,
  remote: 'origin',
  url: REPO_URL,
  ref: BRANCH,
  force: true,
  onAuth: () => ({ username: TOKEN, password: '' }),
  onMessage: (msg) => process.stdout.write(msg),
});

if (result.error) {
  console.error(`❌  Push failed: ${result.error}`);
  process.exit(1);
} else {
  console.log('\n✨  Successfully pushed to GitHub!');
  console.log(`🔗  Repository: https://github.com/charubooma/promptwars-chennai-charuboomaar`);
  console.log('\n📌  Next: Set up the GCP_SA_KEY secret in your GitHub repo settings,');
  console.log('    then every push to main will auto-deploy to Cloud Run!');
}
