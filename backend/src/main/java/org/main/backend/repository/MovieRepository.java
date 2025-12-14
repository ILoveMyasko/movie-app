package org.main.backend.repository;

import org.main.backend.model.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MovieRepository extends MongoRepository<Movie, String> {

    Page<Movie> findMoviesByGenre(String genre, Pageable pageable);
}
