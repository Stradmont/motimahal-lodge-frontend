import { MediaItem } from './media';

export enum BlogStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
  UNPUBLISHED = 'UNPUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum BlogCategory {
  TRAVEL_GUIDE = 'TRAVEL_GUIDE',
  LOCAL_CULTURE = 'LOCAL_CULTURE',
  FOOD_DINING = 'FOOD_DINING',
  SAFARI_WILDLIFE = 'SAFARI_WILDLIFE',
  NEWS_EVENTS = 'NEWS_EVENTS',
  GENERAL = 'GENERAL',
}

export const BLOG_CATEGORY_LABELS: Record<BlogCategory, string> = {
  [BlogCategory.TRAVEL_GUIDE]: 'Travel Guide',
  [BlogCategory.LOCAL_CULTURE]: 'Local Culture',
  [BlogCategory.FOOD_DINING]: 'Food & Dining',
  [BlogCategory.SAFARI_WILDLIFE]: 'Safari & Wildlife',
  [BlogCategory.NEWS_EVENTS]: 'News & Updates',
  [BlogCategory.GENERAL]: 'General',
};

export interface BlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category: BlogCategory;
  authorName?: string;
  imageId?: string;
  image?: MediaItem;
  status: BlogStatus;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BlogQueryParams {
  limit?: number;
  page?: number;
  search?: string;
  status?: BlogStatus | string;
  category?: BlogCategory | string;
}
