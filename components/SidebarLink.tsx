'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SidebarLink({
  href,
  children,
}: {
  href: Route;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={isActive ? 'is-active' : undefined}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}
