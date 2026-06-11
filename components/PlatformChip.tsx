export function PlatformChip({
  platform,
  external = true,
}: {
  platform: { label: string; href: string };
  external?: boolean;
}) {
  const isExternal = external && platform.href.startsWith('http');
  const className = 'platform-chip';

  if (isExternal) {
    return (
      <a
        className={className}
        href={platform.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {platform.label}
      </a>
    );
  }

  return (
    <a className={className} href={platform.href}>
      {platform.label}
    </a>
  );
}
