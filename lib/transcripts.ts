import fs from 'fs';
import path from 'path';
import type { Episode } from '@/lib/episodes';
import { SITE_URL } from '@/lib/site';

const TRANSCRIPTS_DIR = path.join(process.cwd(), 'public', 'transcripts');
const SAFE_SLUG = /^[a-zA-Z0-9_-]+$/;

function isSafeSlug(slug: string): boolean {
  return SAFE_SLUG.test(slug) && !slug.includes('..');
}

export function readTranscript(slug: string): string | null {
  if (!isSafeSlug(slug)) return null;
  try {
    const filePath = path.join(TRANSCRIPTS_DIR, path.basename(`${slug}.md`));
    if (!filePath.startsWith(TRANSCRIPTS_DIR)) return null;
    if (!fs.existsSync(filePath)) return null;
    return fs.readFileSync(filePath, 'utf-8').trim() || null;
  } catch {
    return null;
  }
}

export function hasTranscript(slug: string): boolean {
  return readTranscript(slug) !== null;
}

export function getTranscriptUrl(slug: string): string | null {
  if (!hasTranscript(slug)) return null;
  return `${SITE_URL}/transcripts/${slug}.md`;
}

export function transcriptFlagsForEpisodes(
  episodes: Episode[],
): Map<string, boolean> {
  const flags = new Map<string, boolean>();
  for (const ep of episodes) {
    flags.set(ep.slug, hasTranscript(ep.slug));
  }
  return flags;
}
