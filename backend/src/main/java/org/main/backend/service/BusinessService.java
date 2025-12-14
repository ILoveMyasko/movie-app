package org.main.backend.service;

import lombok.AllArgsConstructor;
import org.bson.types.ObjectId;
import org.main.backend.dto.*;
import org.main.backend.exceptions.ResourceNotFoundException;
import org.main.backend.mapper.ModelMapper;
import org.main.backend.model.Director;
import org.main.backend.model.Movie;
import org.main.backend.model.Review;
import org.main.backend.repository.DirectorRepository;
import org.main.backend.repository.MovieRepository;
import org.main.backend.repository.ReviewRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.stereotype.Service;

import java.util.List;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Service
@AllArgsConstructor
public class BusinessService {
    private final DirectorRepository directorRepository;
    private final MovieRepository movieRepository;
    private final ReviewRepository reviewRepository;
    private final MongoTemplate mongoTemplate;

    public Page<ResponseMovieDto> getMoviesByCategory(String genre, Pageable pageable)
    {
        Page<Movie> movies = movieRepository.findMoviesByGenre(genre, pageable);
        return movies.map(ModelMapper::toMovieDto);
    }

    public ResponseDirectorDto getDirector(String id)
    {
       Director director = directorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Director not found"));
       return ModelMapper.toDirectorDto(director);
    }

    public ResponseReviewDto createReview(CreateReviewDto reviewDto)
    {

        System.out.println(reviewDto);
        if (!movieRepository.existsById(reviewDto.getMovieId()))
            throw new ResourceNotFoundException("Movie not found");
        Review review = Review.builder()
                .comment(reviewDto.getComment())
                .rating(reviewDto.getRating())
                .movieId(new ObjectId(reviewDto.getMovieId()))
                .userName(reviewDto.getUserName())
                .build();
        Review newReview =  reviewRepository.save(review);
        return ModelMapper.toReviewDto(newReview);
    }
    public ResponseDirectorDto createDirector(CreateDirectorDto directorDto)
    {
        Director director = Director.builder()
                .name(directorDto.getName())
                .birthYear(directorDto.getBirthYear())
                .country(directorDto.getCountry())
                .build();
        Director newDirector =  directorRepository.save(director);
        return ModelMapper.toDirectorDto(newDirector);
    }
    public ResponseMovieDto createMovie(CreateMovieDto movieDto)
    {
        if (!directorRepository.existsById(movieDto.getDirectorId()))
            throw new ResourceNotFoundException("Director not found");
        Movie movie = Movie.builder()
                .title(movieDto.getTitle())
                .genre(movieDto.getGenre())
                .description(movieDto.getDescription())
                .directorId(movieDto.getDirectorId())
                .releaseYear(movieDto.getReleaseYear())
                .build();
        Movie newMovie = movieRepository.save(movie);
        return ModelMapper.toMovieDto(newMovie);
    }

    public Page<ResponseReviewDto> getReviewsByMovieId(String movieId, Pageable pageable)
    {
        Page<Review> reviews =  reviewRepository.getReviewByMovieId(new ObjectId(movieId), pageable);
        return reviews.map(ModelMapper::toReviewDto);
    }

    public Page<ResponseMovieDto> getTopMoviesByRating(Pageable pageable)
    {
        Aggregation aggregation = newAggregation(
                group("movie_id").avg("rating").as("calculatedRating"),
                sort(Sort.Direction.DESC, "calculatedRating"),
                skip((long) pageable.getPageNumber() * pageable.getPageSize()),
                limit(pageable.getPageSize()),
                lookup("movie", "_id", "_id", "movieData"),
                unwind("movieData", false),
                addFields().addField("movieData.averageRating").withValue("$calculatedRating").build(),
                replaceRoot("movieData")
        );
        List<Movie> movies = mongoTemplate.aggregate(aggregation, "review", Movie.class)
                .getMappedResults();
        Aggregation countAggr = newAggregation(group("movie_id"), count().as("total"));
        long total= mongoTemplate.aggregate(countAggr, "review", org.bson.Document.class)
                .getMappedResults().size();
        Page<Movie> getMovies =  new PageImpl<>(movies, pageable, total);
        return getMovies.map(ModelMapper::toMovieDto);
    }
}
