export interface BlogPost {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string;
  category: string;
  readingTimeMinutes: number;
  seoTitle: string;
  seoDescription: string;
  tableOfContents: TocItem[];
  sections: Section[];
  keyTakeaways: string[];
  faqs: FAQ[];
  tags: string[];
  location?: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export interface Section {
  id: string;
  title: string;
  content: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
