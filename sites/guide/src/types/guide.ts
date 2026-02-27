export interface GuideArticle {
  slug: string;
  title: string;
  category: string;
  order: number;
  description: string;
  content: string;
  service: string;
}

export interface GuideArticleSummary {
  slug: string;
  title: string;
  category: string;
  order: number;
  description: string;
  service: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface NavGroup {
  heading: string;
  sections: NavSection[];
}

export interface NavItem {
  title: string;
  href: string;
}
