const sanitizeHtml = require("sanitize-html");

module.exports = {
  "candidature-partenaire-de-la-charte": {
    from: process.env.SMTP_FROM || "adresse@data.gouv.fr",
    to: "adresse@data.gouv.fr",
    subject: "Nouvelle candidature aux partenaires de la charte",
    text: `Bonjour,\n\nUne nouvelle candidature aux partenaires de la charte a été soumise.\n\nVous pouvez la consulter sur <a href="${process.env.NEXT_PUBLIC_BAL_ADMIN_URL}/partenaires-de-la-charte?tab=candidatures">BAL Admin</a>.\n\nBonne journée,\n\nL’équipe BAL`,
    html: `<p>Bonjour,</p><p>Une nouvelle candidature aux partenaires de la charte a été soumise.</p><p>Vous pouvez la consulter sur <a href="${process.env.NEXT_PUBLIC_BAL_ADMIN_URL}/partenaires-de-la-charte?tab=candidatures">BAL Admin</a>.</p><p>Bonne journée,</p><p>L’équipe BAL</p>`,
  },
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
  signalementToCommune: (
    { firstName, lastName, email, message, subject, street, number },
    to,
    publication
  ) => {
    return {
      from: process.env.SMTP_FROM || "adresse@data.gouv.fr",
      to,
      subject: `Signalement d'un problème d'adressage - ${subject}`,
      html: sanitizeHtml(
        `<p>Bonjour,</p>
        <p>Nous vous contactons suite à la demande de l'un de vos administrés dont l'adresse ne remonte pas dans la Base Adresse Nationale.</p>
        <p>Voici le détail de son signalement ainsi que ses coordonnées afin que vous puissiez prendre contact avec lui :</p>
        <p>Objet du signalement : <b>${subject}</b></p>
        ${street ? `<p>Voie : <b>${street}</b></p>` : ""}
        ${number ? `<p>Numéro : <b>${number}</b></p>` : ""}
        ${message ? `<p>Message : <em>${message}</em></p>` : ""}
        ${(firstName || lastName) ? `<p>Coordonnées du demandeur : <b>${firstName} ${lastName}</b>` : ""}
        <p>Email du demandeur : <b>${email}</b></p>
        ${publication.client === 'Mes Adresses' ? 
          '<p>Afin de prendre en compte ce signalement, vous pouvez vous rendre sur le site <a href="https://mes-adresses.data.gouv.fr" target="_blank">mes-adresses.data.gouv.fr</a> sur la page de la Base Adresse Locale de votre <a href="https://mes-adresses.data.gouv.fr/bal/${communeBALId}" target="_blank">commune</a>.</p>' : 
          publication.client === 'Moissonneur BAL' ? 
          `<p>Afin de prendre en compte ce signalement, vous pouvez vous rapprocher de l'organisation <b>${publication.organization}</b> qui gère la publication de la Base Adresse Locale de votre commune.</p>` :
          publication.client ? 
          `<p>Afin de prendre en compte ce signalement, vous pouvez vous rapprocher de l'organisation <b>${publication.client}</b> qui gère la publication de la Base Adresse Locale de votre commune.</p>` : 
          `<p>Vous pouvez prendre en compte ce signalement en vous rendant sur le site <a href="https://mes-adresses.data.gouv.fr" target="_blank">mes-adresses.data.gouv.fr</a> et en créant une Base Adresse Locale pour votre commune. Pour vous aider dans cette démarche, vous pouvez consulter cet <a href="https://guide.mes-adresses.data.gouv.fr/creeer-une-base-adresse-locale/creer-une-nouvelle-base-adresse-locale" target="_blank">article</a> qui explique les étapes de la création d'une Base Adresse Locale. Vous trouverez aussi de la documentation et des tutoriels vidéos directement sur le site <a href="https://mes-adresses.data.gouv.fr" target="_blank">mes-adresses.data.gouv.fr</a>. Enfin, vous pouvez vous inscrire pour suivre un de nos webinaire sur la prise en main de l'outil sur cette <a href="https://adresse.data.gouv.fr/evenements" target="_blank">page</a>.</p>`
        }
        <p>Ceci est un message automatique, mais vous pouvez nous contacter via l'email <b>adresse@data.gouv.fr</b> pour obtenir des informations complémentaires.</p>
        <p>Cordialement,</p>
        <p>L’équipe adresse.data.gouv</p>`
      ),
    };
  },
};
