import { MediaItem } from './media';

export enum GallerySectionStatus {
  ACTIVE = 'ACTIVE',
  DRAFT = 'DRAFT',
  INACTIVE = 'INACTIVE',
}

export enum GalleryCategory {
  HOME_ABOUT = 'home-about',
  ABOUT = 'about',
  ROOMS = 'rooms',
  GENERAL = 'general',
}

export interface GallerySectionItem {
  id: string;
  title: string;
  slug: string;
  description?: string;
  category?: GalleryCategory;
  status: GallerySectionStatus;
  mediaIds: string[];
  mediaItems?: MediaItem[];
  sortOrder?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateGallerySectionInput {
  title: string;
  slug?: string;
  description?: string;
  category: GalleryCategory;
  status: GallerySectionStatus;
  mediaIds: string[];
}

export interface UpdateGallerySectionInput extends Partial<CreateGallerySectionInput> {
  id: string;
}
