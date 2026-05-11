'use client';

import { useEffect } from 'react';

export function MobileControls() {
  useEffect(() => {
    const sidebar = document.getElementById('sidebar');
    const mask = document.getElementById('sidebarMask');
    const burgerBtn = document.getElementById('burgerBtn');
    if (!sidebar || !mask || !burgerBtn) return;

    function openMenu() {
      sidebar!.classList.add('is-open');
      mask!.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      sidebar!.classList.remove('is-open');
      mask!.classList.remove('is-visible');
      document.body.style.overflow = '';
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeMenu();
    }

    burgerBtn.addEventListener('click', openMenu);
    mask.addEventListener('click', closeMenu);
    document.addEventListener('keydown', onKey);

    return () => {
      burgerBtn.removeEventListener('click', openMenu);
      mask.removeEventListener('click', closeMenu);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return null;
}
