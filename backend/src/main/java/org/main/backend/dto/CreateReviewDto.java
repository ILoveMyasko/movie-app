package org.main.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateReviewDto {
    @NotBlank @Size(min = 3, max = 100)
    String userName;
    @NotNull
    @Min(1) @Max(10)
    Integer rating;
    @Size(min = 1, max = 1000)
    String comment;
    String movieId;
}
