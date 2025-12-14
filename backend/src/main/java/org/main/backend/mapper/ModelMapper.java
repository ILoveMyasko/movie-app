package org.main.backend.mapper;

import org.main.backend.dto.ResponseDirectorDto;
import org.main.backend.dto.ResponseMovieDto;
import org.main.backend.dto.ResponseReviewDto;
import org.main.backend.model.Director;
import org.main.backend.model.Movie;
import org.main.backend.model.Review;

public class ModelMapper {
    public static ResponseDirectorDto toDirectorDto(Director director) {
        return ResponseDirectorDto.builder()
                .id(director.getId())
                .name(director.getName())
                .birthYear(director.getBirthYear())
                .country(director.getCountry())
                .build();
    }
    public static ResponseMovieDto toMovieDto(Movie movie) {
        return ResponseMovieDto.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .genre(movie.getGenre())
                .releaseYear(movie.getReleaseYear())
                .description(movie.getDescription())
                .directorId(movie.getDirectorId())
                .build();
    }
    public static ResponseReviewDto toReviewDto(Review review) {
        return ResponseReviewDto.builder()
                .movieId(review.getMovieId().toString())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .userName(review.getUserName())
                .id(review.getId())
                .rating(review.getRating())
                .build();
    }
}
