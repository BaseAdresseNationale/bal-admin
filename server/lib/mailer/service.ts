import nodemailer from "nodemailer";
import templates from "./email.templates";
import { getCommuneEmail } from "../../utils/api-annuaire";
import { MailDTO } from "./dto";
import { validateOrReject } from "class-validator";
import { Participant } from "../participant/entity";
import { Event } from "../events/entity";

const apiDepotBaseUrl =
  process.env.NEXT_PUBLIC_API_DEPOT_URL ||
  "https://plateforme-bal.adresse.data.gouv.fr/api-depot";

function createTransport() {
  // Use mailhog in development
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === "YES",
      ...(process.env.SMTP_USER &&
        process.env.SMTP_PASS && {
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        }),
    });
  } else {
    if (process.env.NODE_ENV == "production") {
      throw new Error("SMTP_HOST must be provided in production mode");
    }
    return nodemailer.createTransport();
  }
}

const transport = createTransport();

async function checkCaptcha(captchaToken) {
  const response = await fetch(`https://api.hcaptcha.com/siteverify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `response=${captchaToken}&secret=${process.env.HCAPTCHA_SECRET_KEY}`,
  });

  const json = await response.json();

  if (!json.success) {
    throw new Error("Le captcha est invalide");
  }

  return json.success;
}

export async function sendTemplateMail(templateKey) {
  const template = templates[templateKey];
  if (!template) {
    throw new Error(`Le template ${templateKey} n'existe pas`);
  }

  const response = await transport.sendMail(template);

  if (!response) {
    throw new Error("Une erreur est survenue lors de l'envoi de l'email");
  }

  return true;
}

export async function sendFormContactMail(payload: MailDTO) {
  await validateOrReject(payload);
  const { captchaToken, ...emailData } = payload;

  await checkCaptcha(captchaToken);

  const contactTemplate = templates.contact(emailData);

  const response = await transport.sendMail(contactTemplate);

  if (!response) {
    throw new Error("Une erreur est survenue lors de l'envoi de l'email");
  }

  return true;
}

export async function sendSignalementToCommune(payload: MailDTO) {
  await validateOrReject(payload);

  const { captchaToken, ...emailData } = payload;

  await checkCaptcha(captchaToken);

  const communeEmail = await getCommuneEmail(emailData.city);

  const currentRevisionResponse = await fetch(
    `${apiDepotBaseUrl}/communes/${emailData.city}/current-revision`
  );
  const currentRevision = await currentRevisionResponse.json();
  const publication: any = {
    client: currentRevision?.client?.nom,
  };
  if (currentRevision?.client?.nom === "Mes Adresses") {
    publication.balId = currentRevision?.context?.extras?.balId;
  } else if (currentRevision?.client?.nom === "Moissonneur BAL") {
    const sourceId = currentRevision?.context?.extras?.sourceId;
    if (sourceId) {
      const response = await fetch(
        `https://www.data.gouv.fr/api/1/datasets/${sourceId}`
      );
      const dataset = await response.json();
      publication.organization = dataset?.organization?.name;
    }
  }

  const template = templates.signalementToCommune(
    emailData,
    communeEmail,
    publication
  );

  const response = await transport.sendMail(template);

  if (!response) {
    throw new Error("Une erreur est survenue lors de l'envoi de l'email");
  }

  return true;
}

export async function sendParticipationEvenement(
  event: Event,
  participant: Participant
) {
  const template = templates.participationEvenement(event, participant.email);

  const response = await transport.sendMail(template);

  if (!response) {
    throw new Error("Une erreur est survenue lors de l'envoi de l'email");
  }

  return true;
}

export async function sendReviewReceived(partenaireId: string) {
  const template = templates.reviewReceived({ partenaireId });

  const response = await transport.sendMail(template);

  if (!response) {
    throw new Error("Une erreur est survenue lors de l'envoi de l'email");
  }

  return true;
}

export async function sendEmailVerification(
  email: string,
  verificationLink: string
) {
  const template = templates.emailVerification(verificationLink, email);

  const response = await transport.sendMail(template);

  if (!response) {
    throw new Error("Une erreur est survenue lors de l'envoi de l'email");
  }

  return true;
}
