export interface GeneratedBook {
  coverImage: string;
  pages: string[];
  theme: string;
  childName: string;
}

export interface GenerationState {
  status: 'idle' | 'generating' | 'complete' | 'error';
  message?: string;
  progress?: number; // 0 to 100
}

export interface ColoringPageRequest {
  theme: string;
  childName: string;
}
