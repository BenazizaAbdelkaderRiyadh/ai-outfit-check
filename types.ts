export interface UserProfile {
  photo: string; // base64 data URL
  photoMimeType: string;
  age: number;
  height: number;
  weight: number;
}

export interface Outfit {
  id: string;
  description?: string;
  photo?: string; // base64 data URL
  photoMimeType?: string;
  size: string;
  background: 'original' | 'white';
  generatedImages?: string[]; // base64 data URL array for front, back, side views
  isLoading: boolean;
  error?: string;
}