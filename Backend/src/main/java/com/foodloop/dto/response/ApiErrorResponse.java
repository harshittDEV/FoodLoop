package com.foodloop.dto.response;

import java.time.Instant;

/** Standard error envelope returned for 4xx / 5xx responses. */
public class ApiErrorResponse {

    private boolean success = false;
    private int status;
    private String error;
    private Instant timestamp = Instant.now();

    public ApiErrorResponse() {}

    public ApiErrorResponse(int status, String error) {
        this.status = status;
        this.error = error;
    }

    public boolean isSuccess()  { return success; }
    public int getStatus()      { return status; }
    public String getError()    { return error; }
    public Instant getTimestamp(){ return timestamp; }
}
