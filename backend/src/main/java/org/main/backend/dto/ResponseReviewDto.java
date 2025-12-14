package org.main.backend.dto;

import lombok.Builder;
import lombok.Data;


import java.time.Instant;

@Builder
@Data
public class ResponseReviewDto {
    String id;
    String userName;
    Integer rating;
    String comment;
    Instant createdAt;
    String movieId;
}
