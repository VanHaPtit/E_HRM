package QLNV.Service;

import QLNV.DTO.request.EmailRequest;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import com.sendgrid.helpers.mail.objects.Personalization;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class SendGridMailService {

    @Value("${send_grid.api_key}")
    private String sendGridApiKey;

    @Value("${send_grid.from_email}")
    private String fromEmail;

    @Value("${send_grid.from_name}")
    private String fromName;

    public void sendMail(EmailRequest emailRequest) throws IOException {
        Mail mail = new Mail();
        mail.setFrom(new Email(fromEmail, fromName));
        mail.setSubject(emailRequest.getSubject());
        mail.addContent(new Content("text/plain", emailRequest.getContent()));

        Personalization personalization = new Personalization();
        for (String toEmailStr : emailRequest.getToEmails()) {
            if (toEmailStr != null && !toEmailStr.trim().isEmpty()) {
                personalization.addTo(new Email(toEmailStr.trim()));
            }
        }
        mail.addPersonalization(personalization);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            System.out.println(response.getStatusCode());
            System.out.println(response.getBody());
            System.out.println(response.getHeaders());
        } catch (IOException ex) {
            throw ex;
        }
    }
}
