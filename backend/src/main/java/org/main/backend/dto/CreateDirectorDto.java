package org.main.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateDirectorDto {
    @NotBlank
    @Size(min = 1, max = 100)
    String name;
    @NotNull
    @Min(1700) @Max(2015)
    Integer birthYear;
    @NotBlank @Size(min = 1, max = 100)
    String country;
}
