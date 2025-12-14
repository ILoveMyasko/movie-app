package org.main.backend.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ResponseMovieDto {
    String id;
    String title;
    String genre;
    Integer releaseYear;
    String description;
    String directorId;
    String imageUrl;
}
