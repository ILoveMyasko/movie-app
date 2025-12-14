package org.main.backend.repository;

import org.bson.types.ObjectId;
import org.main.backend.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
    Page<Review> getReviewByMovieId(ObjectId movieId, Pageable pageable);
    List<Review> findAllByMovieId(ObjectId movieId);
}
