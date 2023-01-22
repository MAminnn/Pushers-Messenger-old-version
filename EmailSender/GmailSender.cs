using System;
using System.Collections.Generic;
using System.Net.Mail;
using System.Text;

namespace EmailSender
{
    public class GmailSender : IEmailSender
    {
        public void SendEmail(string FromEmailPassword,string ToEmail,string Subject,string Body,bool IsHtmlOn,string FromEmail,int? Port, string Host = "")
        {
            using (MailMessage mail = new MailMessage())
            {
                mail.From = new MailAddress(FromEmail);
                mail.To.Add(ToEmail);
                mail.Subject = Subject;
                mail.Body = Body;
                mail.IsBodyHtml = IsHtmlOn;

                using (SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587))
                {
                    smtp.UseDefaultCredentials = true;
                    smtp.Credentials = new System.Net.NetworkCredential(FromEmail,FromEmailPassword);
                    smtp.EnableSsl = true;
                    smtp.Send(mail);
                }
            }
        }
    }
}
