package org.main.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import tools.jackson.databind.annotation.JsonSerialize;
import tools.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document
public class Review {
    @Id
    String id;
    String userName;
    Integer rating;
    String comment;
    @CreatedDate
    Instant createdAt;
    @Indexed @Field("movie_id") @JsonSerialize(using = ToStringSerializer.class) // or FieldType.ObjectId
    ObjectId movieId;
}
