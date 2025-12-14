package org.main.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document
public class Movie {
    @Id
    String id;
    String title;
    String genre;
    Integer releaseYear;
    String description;
    String imageUrl;
    @Indexed
    String directorId;
    @Transient
    private Double averageRating;
}
