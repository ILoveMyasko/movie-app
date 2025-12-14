export interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string;
  releaseYear: number;
  directorId: string;
  imageUrl?: string;
}

export interface Director {
  id: string;
  name: string;
}

export interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: PageInfo;
}

export interface ReviewRequest {
  movieId: string;
  userName: string;
  rating: number;
  comment: string;
}

export interface ReviewResponse {
  id: string;
  movieId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}