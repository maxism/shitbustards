'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SidebarLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive =
    href === '/' ? pathname === '/' : pathname.startsWith(href);

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
