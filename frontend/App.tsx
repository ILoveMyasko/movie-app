import React, { useState, useEffect, useCallback } from 'react';
import { movieService } from './services/api';
import { Movie, Director, PaginatedResponse, ReviewRequest, ReviewResponse } from './types';
import { Navbar } from './components/Navbar';
import { MovieCard } from './components/MovieCard';
import { ReviewForm } from './components/ReviewForm';
import { Loader2, AlertCircle, ChevronLeft, ChevronRight, ArrowLeft, Star, User } from 'lucide-react';

// Common genres to populate the dropdown
const GENRES = [
    'fantasy',
    'action',
    'drama',
    'comedy',
    'scifi',
    'horror',
    'romance',
    'thriller'
];

type View = 'top' | 'genre' | 'detail';

export default function App() {
    const [currentView, setCurrentView] = useState<View>('top');

    // Data State
    const [movies, setMovies] = useState<Movie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [selectedDirector, setSelectedDirector] = useState<Director | null>(null);
    const [reviews, setReviews] = useState<ReviewResponse[]>([]);

    // Filter/Pagination State
    const [selectedGenre, setSelectedGenre] = useState<string>('fantasy');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // UI State
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch Top Movies
    const fetchTopMovies = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await movieService.getTopMovies();
            setMovies(data.content);
            // Top movies endpoint might be paginated but usually we just show the first batch on a "Top" page
        } catch (err) {
            setError('Failed to load top movies. Is the backend running?');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch Movies by Genre
    const fetchMoviesByGenre = useCallback(async (genre: string, page: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await movieService.getMoviesByGenre(genre, page, 8); // Size 8 for grid
            setMovies(data.content);
            setTotalPages(data.page.totalPages);
        } catch (err) {
            setError(`Failed to load ${genre} movies.`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch Movie Details & Reviews
    const fetchMovieDetail = async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            // 1. Fetch movie details
            const movie = await movieService.getMovieById(id);
            setSelectedMovie(movie);

            // 2. Fetch reviews and director in parallel once we have the movie (for directorId)
            const [reviewsData, director] = await Promise.all([
                movieService.getReviewsByMovieId(id),
                movieService.getDirectorById(movie.directorId)
            ]);

            setReviews(reviewsData.content);
            setSelectedDirector(director);
            setCurrentView('detail');
        } catch (err) {
            setError('Failed to load movie details.');
        } finally {
            setIsLoading(false);
        }
    };

    // Initial Load
    useEffect(() => {
        if (currentView === 'top') {
            fetchTopMovies();
        } else if (currentView === 'genre') {
            fetchMoviesByGenre(selectedGenre, currentPage);
        }
    }, [currentView, selectedGenre, currentPage, fetchTopMovies, fetchMoviesByGenre]);

    // Handlers
    const handleViewChange = (view: 'top' | 'genre') => {
        setCurrentView(view);
        setError(null);
        setMovies([]);
        if (view === 'genre') {
            setCurrentPage(0);
        }
    };

    const handleMovieClick = (id: string) => {
        fetchMovieDetail(id);
    };

    const handleBack = () => {
        // Go back to the previous main view
        setSelectedMovie(null);
        setSelectedDirector(null);
        setReviews([]);
        setCurrentView(movies.length > 0 && selectedGenre ? 'genre' : 'top');
    };

    const handleReviewSubmit = async (review: ReviewRequest) => {
        await movieService.addReview(review);
        // Refresh reviews
        if (selectedMovie) {
            try {
                const reviewsData = await movieService.getReviewsByMovieId(selectedMovie.id);
                setReviews(reviewsData.content);
            } catch (e) {
                console.error("Failed to refresh reviews", e);
            }
        }
    };

    // --- RENDER HELPERS ---

    const renderLoader = () => (
        <div className="flex h-64 w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
    );

    const renderError = () => (
        <div className="mx-auto mt-10 flex max-w-lg flex-col items-center rounded-lg border border-red-500/20 bg-red-500/10 p-6 text-center">
            <AlertCircle className="mb-3 h-10 w-10 text-red-500" />
            <h3 className="text-lg font-semibold text-red-400">Something went wrong</h3>
            <p className="text-sm text-red-300/80">{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-md bg-red-500/20 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/30"
            >
                Reload Page
            </button>
        </div>
    );

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) {
            return dateString;
        }
    };

    // --- VIEW: LIST (Top or Genre) ---
    const renderMovieList = () => (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header / Controls */}
            <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        {currentView === 'top' ? 'Top Rated Movies' : 'Browse by Genre'}
                    </h1>
                    <p className="mt-1 text-slate-400">
                        {currentView === 'top'
                            ? 'Discover the highest rated masterpieces.'
                            : 'Explore movies based on your favorite categories.'}
                    </p>
                </div>

                {currentView === 'genre' && (
                    <div className="relative">
                        <select
                            value={selectedGenre}
                            onChange={(e) => {
                                setSelectedGenre(e.target.value);
                                setCurrentPage(0);
                            }}
                            className="appearance-none rounded-lg border border-white/10 bg-slate-800 py-2.5 pl-4 pr-10 text-sm font-medium text-white shadow-sm hover:border-indigo-500/50 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                            {GENRES.map(g => (
                                <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                )}
            </div>

            {/* Grid */}
            {isLoading ? renderLoader() : error ? renderError() : (
                <>
                    {movies.length === 0 ? (
                        <div className="py-20 text-center text-slate-500">
                            No movies found for this category.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
                            {movies.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} onClick={handleMovieClick} />
                            ))}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {currentView === 'genre' && totalPages > 1 && (
                        <div className="mt-12 flex items-center justify-center gap-4">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                                disabled={currentPage === 0}
                                className="flex items-center gap-1 rounded-lg border border-white/10 bg-slate-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-slate-800"
                            >
                                <ChevronLeft className="h-4 w-4" /> Previous
                            </button>
                            <span className="text-sm font-medium text-slate-400">
                Page {currentPage + 1} of {totalPages}
              </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={currentPage >= totalPages - 1}
                                className="flex items-center gap-1 rounded-lg border border-white/10 bg-slate-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-slate-800"
                            >
                                Next <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );

    // --- VIEW: DETAIL ---
    const renderDetail = () => {
        if (!selectedMovie) return null;

        // Use API image or fallback
        const displayImage = selectedMovie.imageUrl || '/placeholder.png';

        const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            const target = e.target as HTMLImageElement;
            // Prevent infinite loop if placeholder itself is missing or fails
            if (!target.src.endsWith('placeholder.png')) {
                target.src = '/placeholder.png';
            }
        };

        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Hero Section */}
                <div className="relative h-[40vh] w-full overflow-hidden bg-slate-900">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10" />
                    <img
                        src={displayImage}
                        alt="Backdrop"
                        className="h-full w-full object-cover opacity-50 blur-sm"
                        onError={handleImageError}
                    />

                    <div className="absolute top-4 left-4 z-20">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-black/70"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back
                        </button>
                    </div>
                </div>

                <div className="relative z-20 mx-auto -mt-32 max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-8 md:flex-row">
                        {/* Poster */}
                        <div className="shrink-0">
                            <div className="overflow-hidden rounded-xl border-4 border-slate-900 shadow-2xl shadow-black/50 bg-slate-800">
                                <img
                                    src={displayImage}
                                    alt={selectedMovie.title}
                                    className="h-[400px] w-[280px] object-cover md:h-[450px] md:w-[300px]"
                                    onError={handleImageError}
                                />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex flex-1 flex-col justify-end pt-4 md:justify-center md:pb-12">
                            <div className="mb-2 flex items-center gap-3">
                        <span className="rounded-full bg-indigo-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-500/20">
                            {selectedMovie.genre}
                        </span>
                                <span className="text-sm font-medium text-slate-400">
                            {selectedMovie.releaseYear}
                        </span>
                            </div>

                            <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                                {selectedMovie.title}
                            </h1>

                            <p className="mb-6 text-lg leading-relaxed text-slate-300">
                                {selectedMovie.description}
                            </p>

                            <div className="flex flex-col gap-1 text-sm text-slate-400">
                                <p>Director: <span className="text-slate-200 font-medium">{selectedDirector ? selectedDirector.name : 'Loading...'}</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="mt-12 grid gap-12 lg:grid-cols-1">
                        <div className="lg:max-w-4xl">
                            {/* Header */}
                            <div className="mb-8 border-b border-white/10 pb-4">
                                <h2 className="text-2xl font-bold text-white">Community Reviews</h2>
                                <p className="text-slate-400">See what others are saying.</p>
                            </div>

                            <div className="mb-10">
                                <ReviewForm movieId={selectedMovie.id} onSubmit={handleReviewSubmit} />
                            </div>

                            {/* Reviews List */}
                            <div className="space-y-6">
                                {reviews.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-slate-500">
                                        No reviews yet. Be the first to share your thoughts!
                                    </div>
                                ) : (
                                    reviews.map((review) => (
                                        <div key={review.id} className="rounded-xl border border-white/5 bg-slate-900/50 p-6 transition-colors hover:bg-slate-900">
                                            <div className="mb-3 flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                                                        <User className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-white">{review.userName}</div>
                                                        <div className="text-xs text-slate-500">{formatDate(review.createdAt)}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 rounded-md bg-indigo-500/10 px-2 py-1 text-indigo-400">
                                                    <span className="font-bold">{review.rating}</span>
                                                    <Star className="h-3 w-3 fill-indigo-400" />
                                                </div>
                                            </div>
                                            <p className="text-slate-300 leading-relaxed">
                                                {review.comment}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-20" /> {/* Spacer */}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <Navbar
                currentView={currentView === 'detail' ? 'genre' : currentView} // Keep nav highlighted properly
                onViewChange={(v) => {
                    setCurrentView(v);
                    setSelectedMovie(null);
                    if(v === 'genre') setCurrentPage(0);
                }}
                onLogoClick={() => {
                    setCurrentView('top');
                    setSelectedMovie(null);
                }}
            />

            <main>
                {currentView === 'detail' ? renderDetail() : renderMovieList()}
            </main>
        </div>
    );
}