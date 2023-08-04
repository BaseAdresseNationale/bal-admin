module.exports = {
  'candidature-partenaire-de-la-charte': {
    from: process.env.SMTP_FROM || 'adresse@data.gouv.fr',
    to: 'adresse@data.gouv.fr',
    subject: 'Nouvelle candidature aux partenaires de la charte',
    text: `Bonjour,\n\nUne nouvelle candidature aux partenaires de la charte a été soumise.\n\nVous pouvez la consulter sur <a href="${process.env.NEXT_PUBLIC_BAL_ADMIN_URL}/partenaires-de-la-charte?tab=candidatures">BAL Admin</a>.\n\nBonne journée,\n\nL’équipe BAL`,
    html: `<p>Bonjour,</p><p>Une nouvelle candidature aux partenaires de la charte a été soumise.</p><p>Vous pouvez la consulter sur <a href="${process.env.NEXT_PUBLIC_BAL_ADMIN_URL}/partenaires-de-la-charte?tab=candidatures">BAL Admin</a>.</p><p>Bonne journée,</p><p>L’équipe BAL</p>`
  }
}
