import { Movie, Director, PaginatedResponse, ReviewRequest, ReviewResponse } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

export const movieService = {
  getTopMovies: async (): Promise<PaginatedResponse<Movie>> => {
    const response = await fetch(`${API_BASE_URL}/movies/top`);
    if (!response.ok) {
      throw new Error('Failed to fetch top movies');
    }
    return response.json();
  },

  getMoviesByGenre: async (genre: string, page: number = 0, size: number = 10): Promise<PaginatedResponse<Movie>> => {
    // Construct query parameters
    const params = new URLSearchParams({
      genre,
      page: page.toString(),
      size: size.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/movies?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch movies by genre');
    }
    return response.json();
  },

  getMovieById: async (id: string): Promise<Movie> => {
    const response = await fetch(`${API_BASE_URL}/movie/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }
    return response.json();
  },

  getDirectorById: async (id: string): Promise<Director> => {
    const response = await fetch(`${API_BASE_URL}/director/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch director details');
    }
    return response.json();
  },

  getMovieRating: async (id: string): Promise<number> => {
    const response = await fetch(`${API_BASE_URL}/movie/${id}/rating`);
    if (!response.ok) {
      throw new Error('Failed to fetch movie rating');
    }
    // The response is a raw Double number
    return response.json();
  },

  getReviewsByMovieId: async (movieId: string): Promise<PaginatedResponse<ReviewResponse>> => {
    const response = await fetch(`${API_BASE_URL}/reviews?movieId=${movieId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    return response.json();
  },

  addReview: async (review: ReviewRequest): Promise<ReviewResponse> => {
    const response = await fetch(`${API_BASE_URL}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(review),
    });

    if (!response.ok) {
      throw new Error('Failed to submit review');
    }
    return response.json();
  }
};