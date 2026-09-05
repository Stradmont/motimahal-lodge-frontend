import {
  GallerySectionItem,
  CreateGallerySectionInput,
} from '../types/gallery';
import { API_URL } from '@/lib/config/env.config';

const API_BASE_URL = API_URL;
export const GALLERY_SECTIONS_UPDATED_EVENT = 'motimahal_gallery_sections_updated';

export async function fetchGallerySections(
  status?: string,
  search?: string
): Promise<GallerySectionItem[]> {
  const query = new URLSearchParams();
  if (status && status !== 'ALL') {
    query.append('status', status);
  }
  if (search) {
    query.append('search', search);
  }

  const res = await fetch(`${API_BASE_URL}/api/v1/gallery?${query.toString()}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch gallery sections');
  }
  const json = await res.json();
  return json.data || [];
}

export async function createGallerySectionApi(
  input: CreateGallerySectionInput
): Promise<GallerySectionItem> {
  const res = await fetch(`${API_BASE_URL}/api/v1/gallery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create gallery section');
  }
  const json = await res.json();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(GALLERY_SECTIONS_UPDATED_EVENT));
  }
  return json.data;
}

export async function updateGallerySectionApi(
  id: string,
  input: Partial<CreateGallerySectionInput>
): Promise<GallerySectionItem> {
  const res = await fetch(`${API_BASE_URL}/api/v1/gallery/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update gallery section');
  }
  const json = await res.json();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(GALLERY_SECTIONS_UPDATED_EVENT));
  }
  return json.data;
}

export async function deleteGallerySectionApi(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/api/v1/gallery/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete gallery section');
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(GALLERY_SECTIONS_UPDATED_EVENT));
  }
  return true;
}
