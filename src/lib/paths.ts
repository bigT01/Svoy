// Build hrefs consistently across the app
export function buildOfferHref(locale: string, slug: string, menuId: string) {
  return `/${locale}/${menuId}/offers/${slug}`;
}
export function buildHomeHref(locale: string, menuId: string) {
  return `/${locale}/${menuId}`;
}
