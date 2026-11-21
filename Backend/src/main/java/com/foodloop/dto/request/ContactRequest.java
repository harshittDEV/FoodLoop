package com.foodloop.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ContactRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be under 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    @Size(max = 255, message = "Email must be under 255 characters")
    private String email;

    @NotBlank(message = "Topic is required")
    @Size(max = 100, message = "Topic must be under 100 characters")
    private String topic;

    @NotBlank(message = "Message is required")
    @Size(max = 5000, message = "Message must be under 5000 characters")
    private String message;

    public ContactRequest() {}

    public ContactRequest(String name, String email, String topic, String message) {
        this.name = name;
        this.email = email;
        this.topic = topic;
        this.message = message;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
