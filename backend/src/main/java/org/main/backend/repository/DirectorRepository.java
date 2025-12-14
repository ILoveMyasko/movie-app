package org.main.backend.repository;

import org.main.backend.model.Director;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface DirectorRepository extends MongoRepository<Director, String> {
}
