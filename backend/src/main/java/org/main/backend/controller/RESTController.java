package org.main.backend.controller;

import lombok.AllArgsConstructor;
import org.main.backend.dto.*;
import org.main.backend.exceptions.ResourceNotFoundException;
import org.main.backend.model.Director;
import org.main.backend.model.Movie;
import org.main.backend.model.Review;
import org.main.backend.service.BusinessService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class RESTController {
    private final BusinessService businessService;

    @GetMapping @RequestMapping("/movies")
    public ResponseEntity<Page<ResponseMovieDto>> getMoviesByCategory (@RequestParam(required = true) String genre,
                                                                       @PageableDefault Pageable pageable)
    {
        return ResponseEntity.ok(businessService.getMoviesByCategory(genre, pageable));
    }

    @GetMapping @RequestMapping("/movies/top")
    public ResponseEntity<Page<ResponseMovieDto>> getTopMoviesByRating(@PageableDefault Pageable pageable)
    {
        return ResponseEntity.ok(businessService.getTopMoviesByRating(pageable));
    }

    @GetMapping @RequestMapping("/director/{id}")
    public ResponseEntity<ResponseDirectorDto> getDirector(@PathVariable String id)
    {
        return ResponseEntity.ok(businessService.getDirector(id));
    }

    @GetMapping @RequestMapping("/movie/{id}")
    public ResponseEntity<ResponseMovieDto> getMovie(@PathVariable String id)
    {
        return ResponseEntity.ok(businessService.getMovie(id));
    }


    @GetMapping @RequestMapping("/reviews")
    public ResponseEntity<Page<ResponseReviewDto>> getReviewsByMovieId(@RequestParam(required = true) String movieId,
                                                            @PageableDefault(size = 5) Pageable pageable)
    {
        return ResponseEntity.ok(businessService.getReviewsByMovieId(movieId, pageable));
    }

    @GetMapping("/movie/{movieId}/rating")
    public ResponseEntity<Double> getMovieRating(@PathVariable String movieId) {
        Double rating = businessService.getAverageRatingForMovie(movieId);
        return ResponseEntity.ok(rating);
    }

    @PostMapping @RequestMapping("/review")
    public ResponseEntity<ResponseReviewDto> createReview(@RequestBody @Validated CreateReviewDto reviewDto)
    {
        return ResponseEntity.ok(businessService.createReview(reviewDto));
    }

    @PostMapping @RequestMapping("/director")
    public ResponseEntity<ResponseDirectorDto> createDirector(@RequestBody @Validated CreateDirectorDto directorDto)
    {
        return ResponseEntity.ok(businessService.createDirector(directorDto));
    }
    @PostMapping @RequestMapping("/movie")
    public ResponseEntity<ResponseMovieDto> createMovie(@RequestBody @Validated CreateMovieDto movieDto)
    {
        return ResponseEntity.ok(businessService.createMovie(movieDto));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFoundException(ResourceNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
}
