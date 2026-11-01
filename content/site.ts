/** Site-wide settings that stay the same across editions. */
export const site = {
  /**
   * Production URL without a trailing slash, e.g. "https://innex.icecfwu.com".
   * Needed for sitemap.xml and absolute share-image links. `SITE_URL` env overrides it.
   * TODO(launch): set once the domain is decided.
   */
  url: null as string | null,
}
