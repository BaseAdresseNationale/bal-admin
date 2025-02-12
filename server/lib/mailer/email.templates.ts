import sanitizeHtml from "sanitize-html";
import { getMailToCommuneTemplate } from "./mail-to-communes-template";
import { Event } from "../events/entity";
import { getMailToParticipantTemplate } from "./mail-to-participant-template";

const Emails = {
  "candidature-partenaire-de-la-charte": {
    from: process.env.SMTP_FROM || "adresse@data.gouv.fr",
    to: "adresse@data.gouv.fr",
    subject: "Nouvelle candidature aux partenaires de la charte",
    text: `Bonjour,\n\nUne nouvelle candidature aux partenaires de la charte a été soumise.\n\nVous pouvez la consulter sur <a href="${process.env.NEXT_PUBLIC_BAL_ADMIN_URL}/partenaires-de-la-charte?tab=candidatures">BAL Admin</a>.\n\nBonne journée,\n\nL’équipe BAL`,
    html: `<p>Bonjour,</p><p>Une nouvelle candidature aux partenaires de la charte a été soumise.</p><p>Vous pouvez la consulter sur <a href="${process.env.NEXT_PUBLIC_BAL_ADMIN_URL}/partenaires-de-la-charte?tab=candidatures">BAL Admin</a>.</p><p>Bonne journée,</p><p>L’équipe BAL</p>`,
  },
  reviewReceived: ({ partenaireId }) => ({
    from: process.env.SMTP_FROM || "adresse@data.gouv.fr",
    to: "adresse@data.gouv.fr",
    subject: "Un nouvel avis a été posté sur une société",
    text: `Bonjour,\n\nUn nouvel avis sur une société référencée dans l'annuaire des prestataires vient d'être reçu.\n\nVous pouvez le consulter sur <a href="${process.env.NEXT_PUBLIC_BAL_ADMIN_URL}/partenaires-de-la-charte/${partenaireId}">BAL Admin</a>.\n\nBonne journée,\n\nL’équipe BAL`,
    html: `<p>Bonjour,</p><p>Un nouvel avis sur une société référencée dans l'annuaire des prestataires vient d'être reçu.</p><p>Vous pouvez le consulter sur <a href="${process.env.NEXT_PUBLIC_BAL_ADMIN_URL}/partenaires-de-la-charte/${partenaireId}">BAL Admin</a>.</p><p>Bonne journée,</p><p>L’équipe BAL</p>`,
  }),
  contact: ({ firstName, lastName, email, message, subject }) => {
    return {
      from: process.env.SMTP_FROM || "adresse@data.gouv.fr",
      to: "adresse@data.gouv.fr",
      subject: `BAL Widget - ${subject}`,
      text: `Bonjour,\n\nVous avez reçu un nouveau message via le formulaire de contact de BAL Widget.\n\nNom: ${lastName}\nPrénom: ${firstName}\nEmail: ${email}\n\nMessage:\n${message}\n\nBonne journée,\n\nL’équipe BAL`,
      html: sanitizeHtml(
        `<p>Bonjour,</p><p>Vous avez reçu un nouveau message via le formulaire de contact de BAL Widget.</p>${
          lastName ? `<p>Nom: <b>${lastName}</b></p>` : ""
        }${
          firstName ? `<p>Prénom: <b>${firstName}</b></p>` : ""
        }<p>Email: <b>${email}</b></p><p>Message:</p><p><em>${message}</em></p><p>Bonne journée,</p><p>L’équipe BAL</p>`
      ),
    };
  },
  participationEvenement: (
    { title, date, startHour, endHour, href, instructions }: Event,
    to: string
  ) => {
    return {
      from: process.env.SMTP_FROM || "adresse@data.gouv.fr",
      to,
      subject: `Vous êtes inscrit à l'évènement ${title}`,
      html: getMailToParticipantTemplate({
        subject: `Vous êtes inscrit à l'évènement ${title}`,
        title: sanitizeHtml(title),
        date: sanitizeHtml(new Date(date).toLocaleDateString("fr-FR")),
        startHour: sanitizeHtml(startHour),
        endHour: sanitizeHtml(endHour),
        href: sanitizeHtml(href),
        instructions: sanitizeHtml(instructions),
      }),
    };
  },
  signalementToCommune: (
    { firstName, lastName, email, message, subject, street, number },
    to,
    publication
  ) => {
    return {
      from: process.env.SMTP_FROM || "adresse@data.gouv.fr",
      to,
      subject: `Signalement d'un problème d'adressage - ${subject}`,
      html: getMailToCommuneTemplate(
        {
          firstName: sanitizeHtml(firstName),
          lastName: sanitizeHtml(lastName),
          email: sanitizeHtml(email),
          message: sanitizeHtml(message),
          subject,
          street: sanitizeHtml(street),
          number: sanitizeHtml(number),
        },
        publication
      ),
    };
  },
};

export default Emails;
