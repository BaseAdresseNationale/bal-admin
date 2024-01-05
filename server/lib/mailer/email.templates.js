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
      html: `<p>Bonjour,</p><p>Vous avez reçu un nouveau message via le formulaire de contact de la BAL Widget.</p><p>Nom: ${lastName}</p><p>Prénom: ${firstName}</p><p>Email: ${email}</p><p>Message:</p><p>${message}</p><p>Bonne journée,</p><p>L’équipe BAL</p>`
    };
  },
};
