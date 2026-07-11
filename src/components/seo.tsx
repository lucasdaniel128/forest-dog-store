import { Helmet } from "react-helmet-async";
import { SITE_CONFIG } from "@/constants";
import type { SEOProps } from "@/types";

export function SEO({
  title,
  description,
  ogImage = SITE_CONFIG.ogImage,
  url = SITE_CONFIG.url,
  type = "website",
}: SEOProps) {
  const fullTitle = title
    ? `${title} | ${SITE_CONFIG.name}`
    : SITE_CONFIG.name;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || SITE_CONFIG.description} />
      <meta name="keywords" content={SITE_CONFIG.keywords.join(", ")} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || SITE_CONFIG.description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_CONFIG.name} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || SITE_CONFIG.description} />
      <meta name="twitter:image" content={ogImage} />

      <link rel="canonical" href={url} />
    </Helmet>
  );
}
