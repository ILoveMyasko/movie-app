import React, { useState, useEffect } from 'react';
import { Calendar, User, Star } from 'lucide-react';
import { Movie } from '../types';
import { movieService } from '../services/api';

interface MovieCardProps {
  movie: Movie;
  onClick: (id: string) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const [imageSrc, setImageSrc] = useState<string>(movie.imageUrl || '/placeholder.png');
  const [directorName, setDirectorName] = useState<string>('');
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    setImageSrc(movie.imageUrl || '/placeholder.png');
  }, [movie.imageUrl]);

  useEffect(() => {
    let isMounted = true;

    // Fetch Director
    if (movie.directorId) {
      movieService.getDirectorById(movie.directorId)
          .then(director => {
            if (isMounted) setDirectorName(director.name);
          })
          .catch(error => console.error('Failed to fetch director name', error));
    }

    // Fetch Rating
    movieService.getMovieRating(movie.id)
        .then(rate => {
          if (isMounted) setRating(rate);
        })
        .catch(error => console.error('Failed to fetch movie rating', error));

    return () => {
      isMounted = false;
    };
  }, [movie.id, movie.directorId]);

  const handleImageError = () => {
    if (imageSrc !== '/placeholder.png') {
      setImageSrc('/placeholder.png');
    }
  };

  return (
      <div
          onClick={() => onClick(movie.id)}
          className="group relative cursor-pointer overflow-hidden rounded-xl bg-slate-900 border border-white/5 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/30"
      >
        <div className="aspect-[2/3] w-full overflow-hidden bg-slate-800 relative">
          <img
              src={imageSrc}
              alt={movie.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-80 group-hover:opacity-100"
              loading="lazy"
              onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />

          {/* Rating Badge */}
          <div className="absolute top-2 right-2 z-10 rounded-md bg-black/60 px-2 py-1 backdrop-blur-md">
            <div className="flex items-center gap-1 text-xs font-bold text-yellow-400">
              <Star className="h-3 w-3 fill-yellow-400" />
              <span>{rating !== null ? rating.toFixed(1) : '-'}</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 w-full p-4">
        <span className="mb-2 inline-block rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs font-semibold text-indigo-300 backdrop-blur-sm border border-indigo-500/20">
          {movie.genre}
        </span>
          <h3 className="mb-1 text-lg font-bold leading-tight text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
            {movie.title}
          </h3>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{movie.releaseYear}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span className="truncate max-w-[100px]">
              {directorName ? `Dir. ${directorName}` : 'Loading...'}
            </span>
            </div>
          </div>
        </div>
      </div>
  );
};