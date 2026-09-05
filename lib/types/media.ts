export enum MediaDocumentType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export enum MediaEntityType {
  ROOM = 'ROOM',
  BLOG = 'BLOG',
  LESSON = 'LESSON',
  COURSE = 'COURSE',
  GALLERY = 'GALLERY',
  GENERAL = 'GENERAL',
}

export enum MediaSelectorMode {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
}

export interface MediaItem {
  id: string;
  name: string;
  originalFileName: string;
  mimeType: string;
  documentType: MediaDocumentType;
  entityType: MediaEntityType;
  entityId?: string;
  url: string;
  sizeBytes?: number;
  widthPx?: number;
  heightPx?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface UploadMediaInput {
  file: File;
  documentType: MediaDocumentType;
  entityType: MediaEntityType;
  entityId?: string;
}

export interface MediaUsageRef {
  entityType: string;
  entityId: string;
  entityTitle: string;
}

