package com.foodloop.dto.response;

/**
 * Returned on successful sign-in and sign-up.
 * Shape aligns with the frontend AuthContext expectations:
 *   { success, token, user { id, name, email, role, verified, joinedAt } }
 */
public class AuthResponse {

    private boolean success;
    private String token;
    private UserResponse user;
    private String error;

    private AuthResponse() {}

    public static AuthResponse ok(String token, UserResponse user) {
        AuthResponse r = new AuthResponse();
        r.success = true;
        r.token = token;
        r.user = user;
        return r;
    }

    public static AuthResponse signUpOk(UserResponse user) {
        AuthResponse r = new AuthResponse();
        r.success = true;
        r.token = null;
        r.user = user;
        return r;
    }

    public static AuthResponse fail(String error) {
        AuthResponse r = new AuthResponse();
        r.success = false;
        r.error = error;
        return r;
    }

    public boolean isSuccess() { return success; }
    public String getToken()   { return token; }
    public UserResponse getUser() { return user; }
    public String getError()   { return error; }
}
