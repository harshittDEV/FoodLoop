package com.foodloop.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.foodloop.dto.request.ContactRequest;
import com.foodloop.exception.ApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.util.HtmlUtils;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss z").withZone(ZoneId.of("UTC"));

    private final RestClient restClient;
    private final String fromName;
    private final String fromEmail;
    private final String feedbackTo;
    private final String frontendUrl;
    private final boolean devLogLink;
    private final boolean brevoConfigured;

    public EmailService(
            @Value("${foodloop.brevo.api-key:${BREVO_API_KEY:}}") String apiKey,
            @Value("${foodloop.brevo.from-name:${BREVO_FROM_NAME:FoodLoop}}") String fromName,
            @Value("${foodloop.brevo.from-email:${BREVO_FROM_EMAIL:noreply@foodloop.example.com}}") String fromEmail,
            @Value("${foodloop.mail.feedback-to:${FOODLOOP_FEEDBACK_TO:harshitsinghh1128@gmail.com}}") String feedbackTo,
            @Value("${foodloop.frontend.url:http://localhost:3000}") String frontendUrl,
            @Value("${foodloop.dev.log-verification-link:false}") boolean devLogLink) {

        this.fromName = fromName != null && !fromName.isBlank() ? fromName.trim() : "FoodLoop";
        this.fromEmail = fromEmail != null && !fromEmail.isBlank() ? fromEmail.trim() : "noreply@foodloop.example.com";
        this.feedbackTo = feedbackTo != null && !feedbackTo.isBlank() ? feedbackTo.trim() : "harshitsinghh1128@gmail.com";
        this.frontendUrl = frontendUrl;
        this.devLogLink = devLogLink;

        if (apiKey != null && !apiKey.isBlank()) {
            this.brevoConfigured = true;
            this.restClient = RestClient.builder()
                    .baseUrl(BREVO_API_URL)
                    .defaultHeader("api-key", apiKey.trim())
                    .defaultHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                    .defaultHeader("Accept", MediaType.APPLICATION_JSON_VALUE)
                    .build();
        } else {
            this.brevoConfigured = false;
            this.restClient = null;
        }
    }

    public boolean isConfigured() {
        return brevoConfigured;
    }

    /**
     * Send verification email to registered user using Brevo HTTPS API.
     * Verification mail goes directly to the address entered by the signing-up user.
     */
    public void sendVerificationEmail(String toEmail, String userName, String token) {
        String verifyUrl = frontendUrl + "/verify-email?token=" + token;

        if (!brevoConfigured) {
            if (devLogLink) {
                log.warn("╔══════════════════════════════════════════════════════════╗");
                log.warn("║  Brevo not configured — logging verification link (DEV) ║");
                log.warn("╠══════════════════════════════════════════════════════════╣");
                log.warn("║  User:  {}",  toEmail);
                log.warn("║  Link:  {}",  verifyUrl);
                log.warn("╚══════════════════════════════════════════════════════════╝");
                return;
            }
            throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE,
                "Email delivery is not configured. Please set BREVO_API_KEY in your environment or backend .env file.");
        }

        String subject = "Verify your FoodLoop account";
        String html = """
            <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 520px; margin: 0 auto; color: #1B4332;">
              <div style="background: #2D6A4F; padding: 28px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="color: #FEFAE0; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">FoodLoop</h1>
                <p style="color: #D8F3DC; margin: 6px 0 0; font-size: 14px;">Connecting surplus food with communities in need</p>
              </div>
              <div style="padding: 32px 28px; background: #ffffff; border: 1px solid #D8F3DC; border-top: none; border-radius: 0 0 12px 12px;">
                <p style="font-size: 16px; line-height: 1.5; margin-top: 0;">Hi <strong>%s</strong>,</p>
                <p style="color: #555B53; line-height: 1.6; font-size: 15px;">
                  Thank you for joining FoodLoop! Please click the button below to verify your email address and activate your account.
                </p>
                <div style="text-align: center; margin: 32px 0;">
                  <a href="%s" style="background: #2D6A4F; color: #FEFAE0; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; display: inline-block; font-size: 15px;">
                    Verify Email Address
                  </a>
                </div>
                <p style="color: #8D9388; font-size: 13px; line-height: 1.5;">
                  This link expires in 24 hours. If you did not create a FoodLoop account, you can safely ignore this email.
                </p>
                <hr style="border: none; border-top: 1px solid #E8F5E9; margin: 24px 0;">
                <p style="color: #8D9388; font-size: 12px; line-height: 1.5;">
                  If the button above does not work, copy and paste this link into your browser:<br>
                  <a href="%s" style="color: #2D6A4F; word-break: break-all;">%s</a>
                </p>
              </div>
            </div>
            """.formatted(HtmlUtils.htmlEscape(userName), verifyUrl, verifyUrl, verifyUrl);

        BrevoSender sender = new BrevoSender(fromName, fromEmail);
        List<BrevoRecipient> recipients = List.of(new BrevoRecipient(toEmail, userName));
        BrevoEmailRequest requestPayload = new BrevoEmailRequest(sender, recipients, subject, html, null);

        sendViaBrevo(requestPayload, "verification email", toEmail);
    }

    /**
     * Send a contact form query or feedback message to the admin via Brevo HTTPS API.
     * Sender is ALWAYS the configured BREVO_FROM_NAME and BREVO_FROM_EMAIL.
     * Recipient is ALWAYS the configured FOODLOOP_FEEDBACK_TO.
     * Reply-To is set to the submitter's email and name, enabling direct replies.
     */
    public void sendContactEmail(ContactRequest req) {
        if (!brevoConfigured) {
            throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE,
                "Contact form email delivery is not configured. Please set BREVO_API_KEY in your environment or backend .env file.");
        }

        String safeName = HtmlUtils.htmlEscape(req.getName());
        String safeEmail = HtmlUtils.htmlEscape(req.getEmail());
        String safeTopic = HtmlUtils.htmlEscape(req.getTopic());
        String safeMessage = HtmlUtils.htmlEscape(req.getMessage()).replace("\n", "<br/>");
        String formattedDate = DATE_FORMATTER.format(Instant.now());

        String subject = "[FoodLoop Contact] " + req.getTopic() + " from " + req.getName();
        String html = """
            <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #1B4332;">
              <div style="background: #2D6A4F; padding: 24px; border-radius: 12px 12px 0 0;">
                <h2 style="color: #FEFAE0; margin: 0; font-size: 20px;">New Contact Query / Feedback</h2>
                <p style="color: #D8F3DC; margin: 4px 0 0; font-size: 13px;">Received via FoodLoop Contact Form</p>
              </div>
              <div style="padding: 28px; background: #ffffff; border: 1px solid #D8F3DC; border-top: none; border-radius: 0 0 12px 12px;">
                <table style="width: 100%%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
                  <tr>
                    <td style="padding: 8px 0; color: #6B705C; width: 120px;"><strong>From:</strong></td>
                    <td style="padding: 8px 0; color: #1B4332;">%s</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6B705C;"><strong>Email:</strong></td>
                    <td style="padding: 8px 0;"><a href="mailto:%s" style="color: #2D6A4F;">%s</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6B705C;"><strong>Topic:</strong></td>
                    <td style="padding: 8px 0; color: #1B4332;"><span style="background: #E8F5E9; padding: 3px 10px; border-radius: 6px; font-weight: 500;">%s</span></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6B705C;"><strong>Received At:</strong></td>
                    <td style="padding: 8px 0; color: #6B705C; font-size: 13px;">%s</td>
                  </tr>
                </table>
                <hr style="border: none; border-top: 1px solid #E8F5E9; margin: 16px 0;">
                <h3 style="font-size: 15px; color: #2D6A4F; margin-bottom: 10px;">Message:</h3>
                <div style="background: #F8F9FA; padding: 16px 20px; border-radius: 8px; border-left: 4px solid #2D6A4F; font-size: 14px; line-height: 1.6; color: #212529;">
                  %s
                </div>
                <p style="color: #8D9388; font-size: 12px; margin-top: 24px;">
                  &#8505; Click <strong>Reply</strong> in your email client to respond directly to <strong>%s</strong> (%s).
                </p>
              </div>
            </div>
            """.formatted(safeName, safeEmail, safeEmail, safeTopic, formattedDate, safeMessage, safeName, safeEmail);

        BrevoSender sender = new BrevoSender(fromName, fromEmail);
        List<BrevoRecipient> recipients = List.of(new BrevoRecipient(feedbackTo, "FoodLoop Feedback"));
        BrevoRecipient replyTo = new BrevoRecipient(req.getEmail(), req.getName());
        BrevoEmailRequest requestPayload = new BrevoEmailRequest(sender, recipients, subject, html, replyTo);

        sendViaBrevo(requestPayload, "contact/feedback email", feedbackTo);
    }

    /**
     * Executes the HTTP POST call to Brevo transactional email API.
     * Safely logs HTTP status and sanitized error response, avoiding credential or content leaks.
     */
    private void sendViaBrevo(BrevoEmailRequest requestPayload, String contextDescription, String destination) {
        try {
            BrevoEmailResponse response = restClient.post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .body(requestPayload)
                    .retrieve()
                    .body(BrevoEmailResponse.class);

            String messageId = response != null && response.messageId() != null ? response.messageId() : "unknown";
            log.info("Dispatched {} successfully to {} via Brevo (messageId: {})", contextDescription, destination, messageId);
        } catch (RestClientResponseException e) {
            int statusCode = e.getStatusCode().value();
            String sanitizedError = sanitizeErrorBody(e.getResponseBodyAsString());
            log.error("Brevo API error dispatching {} (HTTP status {}): {}", contextDescription, statusCode, sanitizedError);
            throw new ApiException(HttpStatus.BAD_GATEWAY,
                    "Failed to deliver email through Brevo. Please verify email service configuration.");
        } catch (ResourceAccessException e) {
            log.error("Network connectivity error connecting to Brevo API: {}", e.getMessage());
            throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Email delivery service is temporarily unreachable. Please try again later.");
        } catch (Exception e) {
            log.error("Unexpected error dispatching {} via Brevo: {}", contextDescription, e.getMessage());
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "An unexpected error occurred while dispatching email.");
        }
    }

    /**
     * Sanitizes external error response body: trims whitespace, flattens newlines, and truncates.
     * Ensures secrets or excessive internal payloads are never printed to application logs.
     */
    private String sanitizeErrorBody(String raw) {
        if (raw == null || raw.isBlank()) {
            return "No response body received from Brevo API";
        }
        String cleaned = raw.replaceAll("[\\r\\n]+", " ").trim();
        if (cleaned.length() > 200) {
            cleaned = cleaned.substring(0, 200) + "...";
        }
        return cleaned;
    }

    // ── Brevo Request & Response Records ─────────────────────────────────

    public record BrevoSender(String name, String email) {}

    public record BrevoRecipient(String email, String name) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record BrevoEmailRequest(
            BrevoSender sender,
            List<BrevoRecipient> to,
            String subject,
            String htmlContent,
            BrevoRecipient replyTo
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record BrevoEmailResponse(String messageId) {}
}
