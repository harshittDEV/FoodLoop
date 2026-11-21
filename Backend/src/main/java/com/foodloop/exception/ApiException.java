package com.foodloop.exception;

import org.springframework.http.HttpStatus;

/** Base class for application-specific exceptions with HTTP status. */
public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() { return status; }
}
