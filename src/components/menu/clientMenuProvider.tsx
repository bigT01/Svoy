'use client';
import { MenuIdProvider } from './menuContext';

export default function ClientMenuProvider({
  menuId,
  children,
}: {
  menuId: string | null;
  children: React.ReactNode;
}) {
  return <MenuIdProvider value={menuId}>{children}</MenuIdProvider>;
}
