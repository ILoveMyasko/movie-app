package org.main.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.data.mongodb.core.index.Indexed;

@Data
public class CreateMovieDto {
    @NotBlank @Size(min = 1, max = 100)
    String title;
    @NotBlank @Size(min = 1, max = 100)
    String genre;
    @NotNull @Min(1700) @Max(2025)
    Integer releaseYear;
    @Size(min = 1, max = 1000)
    String description;
    @Indexed @NotBlank
    String directorId;
    String imageUrl;
}
