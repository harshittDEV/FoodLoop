package com.foodloop.dto.response;

import com.foodloop.entity.User;
import java.time.Instant;

/**
 * Public user representation sent to the frontend.
 * Field names match what the React components read:
 *   id, name, email, role (lowercase string), verified, joinedAt
 */
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String role;
    private boolean verified;
    private Instant joinedAt;

    public UserResponse() {}

    public static UserResponse from(User user) {
        UserResponse r = new UserResponse();
        r.id = user.getId();
        r.name = user.getName();
        r.email = user.getEmail();
        r.role = user.getRole().getFrontendValue();
        r.verified = user.isVerified();
        r.joinedAt = user.getCreatedAt();
        return r;
    }

    public Long getId()        { return id; }
    public String getName()    { return name; }
    public String getEmail()   { return email; }
    public String getRole()    { return role; }
    public boolean isVerified(){ return verified; }
    public Instant getJoinedAt() { return joinedAt; }
}
