import React, { useEffect } from 'react';

const SITE_NAME = 'KOPKAR ADIS';
const SITE_URL = 'https://koperasi-adis-profile.vercel.app';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

interface SEOProps {
  title: string;
  description: string;
  /** Absolute URL to image for social preview. Defaults to logo. */
  image?: string;
  /** Canonical URL path, e.g. '/tentang-kami'. Defaults to current path. */
  canonicalPath?: string;
  /** Extra JSON-LD structured data (optional). Will be merged with defaults. */
  structuredData?: Record<string, unknown>;
}




const upsertMeta = (querySelector: string, attrKey: string, attrValue: string, contentValue: string) => {
  let el = document.querySelector<HTMLMetaElement>(querySelector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrKey, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', contentValue);
};

const upsertLink = (rel: string, href: string) => {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image = DEFAULT_IMAGE,
  canonicalPath,
  structuredData,
}) => {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const canonicalUrl = `${SITE_URL}${canonicalPath || window.location.pathname}`;

    // ── Basic ──────────────────────────────────────────────────────────────
    document.title = fullTitle;
    upsertMeta('meta[name="description"]', 'name', 'description', description);
    upsertMeta('meta[name="robots"]', 'name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

    // ── Canonical ──────────────────────────────────────────────────────────
    upsertLink('canonical', canonicalUrl);

    // ── Open Graph ─────────────────────────────────────────────────────────
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', image);
    upsertMeta('meta[property="og:image:width"]', 'property', 'og:image:width', '512');
    upsertMeta('meta[property="og:image:height"]', 'property', 'og:image:height', '512');
    upsertMeta('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_NAME);
    upsertMeta('meta[property="og:locale"]', 'property', 'og:locale', 'id_ID');

    // ── Twitter / X Cards ──────────────────────────────────────────────────
    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image);

    // ── JSON-LD Structured Data ────────────────────────────────────────────
    const defaultSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Koperasi Karyawan PT Adis Dimension Footwear (KOPKAR ADIS)',
      alternateName: 'KOPKAR ADIS',
      url: SITE_URL,
      logo: DEFAULT_IMAGE,
      description:
        'Koperasi Konsumen Karyawan PT Adis Dimension Footwear — menyediakan Adis Mart, Simpan Pinjam Syariah, dan Jasa Logistik di Balaraja, Tangerang, Banten.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Jl. Raya Serang Km. 24, Balaraja',
        addressLocality: 'Tangerang',
        addressRegion: 'Banten',
        postalCode: '15610',
        addressCountry: 'ID',
      },
      sameAs: [
        'https://instagram.com/kopkar_adis',
      ],
    };

    const schemaPayload = structuredData
      ? { ...defaultSchema, ...structuredData }
      : defaultSchema;

    let ldScript = document.querySelector<HTMLScriptElement>('script[type="application/ld+json"][data-seo]');
    if (!ldScript) {
      ldScript = document.createElement('script');
      ldScript.type = 'application/ld+json';
      ldScript.setAttribute('data-seo', 'true');
      document.head.appendChild(ldScript);
    }
    ldScript.textContent = JSON.stringify(schemaPayload);
  }, [title, description, image, canonicalPath, structuredData]);

  return null;
};
