import nodemailer from "nodemailer";
import templates from "./email.templates";
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
