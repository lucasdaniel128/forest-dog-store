export interface SEOProps {
  title: string;
  description: string;
  ogImage?: string;
  url?: string;
  type?: "website" | "product" | "article";
}

export interface NavLink {
  label: string;
  href: string;
}

export interface ProductFeature {
  title: string;
  description: string;
  icon?: string;
}

export interface Testimonial {
  name: string;
  role?: string;
  content: string;
  avatar?: string;
  rating?: number;
}

export interface FAQ {
  question: string;
  answer: string;
}
