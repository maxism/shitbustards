import fs from 'fs';
import path from 'path';
import { generateSlug, type Episode } from '@/lib/episodes';
import { SITE_URL } from '@/lib/site';

const TRANSCRIPTS_DIR = path.join(process.cwd(), 'public', 'transcripts');

export function readTranscript(slug: string): string | null {
  try {
    const filePath = path.join(TRANSCRIPTS_DIR, `${slug}.md`);
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
    flags.set(generateSlug(ep), hasTranscript(generateSlug(ep)));
  }
  return flags;
}
