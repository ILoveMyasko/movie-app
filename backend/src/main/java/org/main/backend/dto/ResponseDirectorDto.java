package org.main.backend.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ResponseDirectorDto {
    String id;
    String name;
    Integer birthYear;
    String country;
}
