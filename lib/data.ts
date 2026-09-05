export interface Room {
  id: string;
  slug: string;
  name: string;
  category: string;
  priceNpr: number;
  capacity: string;
  bedType: string;
  sizeSqFt?: number;
  bathroomInfo?: string;
  view?: string;
  image: string;
  galleryImages: string[];
  amenities: string[];
  description: string;
  fullDescription?: string[];
  features?: string[];
  featured?: boolean;
  maxUnits?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  priceNpr: number;
  description: string;
  image: string;
  isPopular?: boolean;
  tags?: string[];
}

export interface Amenity {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface Attraction {
  id: string;
  title: string;
  category: string;
  distance: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  highlights: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  excerpt: string;
  content: string[];
  image: string;
  tags?: string[];
  featured?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  caption: string;
  aspect?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export const ROOMS_DATA: Room[] = [];

export function getRoomBySlug(slug: string): Room | undefined {
  const normalized = slug.toLowerCase().trim();
  return ROOMS_DATA.find((r) => r.slug === normalized || r.id === normalized);
}

export const FOOD_MENU_DATA: MenuItem[] = [];

export const ATTRACTIONS_DATA: Attraction[] = [];

export const BLOG_DATA: BlogPost[] = [];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const normalized = slug.toLowerCase().trim();
  return BLOG_DATA.find((b) => (b.slug || b.id) === normalized || b.id === normalized);
}

export function getRelatedBlogPosts(currentSlug: string, count: number = 3): BlogPost[] {
  const normalized = currentSlug.toLowerCase().trim();
  const filtered = BLOG_DATA.filter((b) => (b.slug || b.id) !== normalized);
  return filtered.slice(0, count);
}

export const GALLERY_DATA: GalleryItem[] = [];

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/moti_mahal_restaurant_lodge/',
  facebook: 'https://www.facebook.com/people/Moti-Mahal-Restaurant-Lodge/61592017018419/',
};
