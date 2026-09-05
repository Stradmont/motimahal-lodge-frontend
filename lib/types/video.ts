export enum VideoPlatform {
  YOUTUBE = 'YouTube',
  INSTAGRAM = 'Instagram',
  FACEBOOK = 'Facebook',
  TIKTOK = 'TikTok',
  VIMEO = 'Vimeo',
  DIRECT_OTHER = 'Direct / Other',
}

export enum VideoStatus {
  PUBLISHED = 'Published',
  DRAFT = 'Draft',
}

export enum VideoCategory {
  VIRTUAL_TOUR = 'Virtual Tour',
  JUNGLE_SAFARI = 'Jungle Safari',
  LODGE_DINING = 'Lodge Dining',
  RESORT_OVERVIEW = 'Resort Overview',
  EVENT_HIGHLIGHT = 'Event Highlight',
  OTHER = 'Other',
}

export interface VideoItem {
  id: string;
  title: string;
  description?: string;
  category: VideoCategory;
  platform: VideoPlatform;
  videoUrl: string;
  thumbnailMediaId?: string;
  thumbnailUrl?: string;
  status: VideoStatus;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVideoInput {
  title: string;
  description?: string;
  category: VideoCategory;
  platform: VideoPlatform;
  videoUrl: string;
  thumbnailMediaId?: string;
  thumbnailUrl?: string;
  status: VideoStatus;
}

export interface UpdateVideoInput extends Partial<CreateVideoInput> {
  id: string;
  orderIndex?: number;
}
