'use client';

import { createContext, useContext } from 'react';

const MenuIdCtx = createContext<string | null>(null);

export function MenuIdProvider({
  value,
  children,
}: {
  value: string | null;
  children: React.ReactNode;
}) {
  return <MenuIdCtx.Provider value={value}>{children}</MenuIdCtx.Provider>;
}

export function useMenuId() {
  return useContext(MenuIdCtx);
}
