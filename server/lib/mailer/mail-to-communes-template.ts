export const getMailToCommuneTemplate = (
  { firstName, lastName, email, message, subject, street, number },
  publication
) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Signalement d'un problème d'adressage - ${subject}</title>
    <style type="text/css" emogrify="no">
      #outlook a {
        padding: 0;
      }
      .ExternalClass {
        width: 100%;
      }
      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: 100%;
      }
      table td {
        border-collapse: collapse;
        mso-line-height-rule: exactly;
      }
      .editable.image {
        font-size: 0 !important;
        line-height: 0 !important;
      }
      .nl2go_preheader {
        display: none !important;
        mso-hide: all !important;
        mso-line-height-rule: exactly;
        visibility: hidden !important;
        line-height: 0px !important;
        font-size: 0px !important;
      }
      body {
        width: 100% !important;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        margin: 0;
        padding: 0;
      }
      img {
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }
      a img {
        border: none;
      }
      table {
        border-collapse: collapse;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      th {
        font-weight: normal;
        text-align: left;
      }
      *[class="gmail-fix"] {
        display: none !important;
      }
    </style>
    <style type="text/css" emogrify="no">
      @media (max-width: 600px) {
        .gmx-killpill {
          content: " \x03D1";
        }
      }
    </style>
    <style type="text/css" emogrify="no">
      @media (max-width: 600px) {
        .gmx-killpill {
          content: " \x03D1";
        }
        .r0-o {
          border-style: solid !important;
          margin: 0 auto 0 auto !important;
          width: 320px !important;
        }
        .r1-i {
          background-color: #f9fafc !important;
        }
        .r2-c {
          box-sizing: border-box !important;
          text-align: center !important;
          valign: top !important;
          width: 100% !important;
        }
        .r3-o {
          border-style: solid !important;
          margin: 0 auto 0 auto !important;
          width: 100% !important;
        }
        .r4-i {
          background-color: #ffffff !important;
          padding-bottom: 20px !important;
          padding-left: 15px !important;
          padding-right: 15px !important;
          padding-top: 20px !important;
        }
        .r5-c {
          box-sizing: border-box !important;
          display: block !important;
          valign: top !important;
          width: 100% !important;
        }
        .r6-o {
          border-style: solid !important;
          width: 100% !important;
        }
        .r7-i {
          padding-left: 0px !important;
          padding-right: 0px !important;
        }
        .r8-c {
          box-sizing: border-box !important;
          text-align: left !important;
          valign: top !important;
          width: 100% !important;
        }
        .r9-o {
          border-style: solid !important;
          margin: 0 auto 0 0 !important;
          width: 100% !important;
        }
        .r10-i {
          padding-bottom: 0px !important;
          padding-top: 0px !important;
        }
        .r11-i {
          background-color: transparent !important;
        }
        .r12-i {
          background-color: #ffffff !important;
          padding-bottom: 0px !important;
          padding-left: 15px !important;
          padding-right: 15px !important;
          padding-top: 0px !important;
        }
        .r13-i {
          padding-bottom: 10px !important;
          padding-top: 10px !important;
          text-align: center !important;
        }
        .r14-i {
          text-align: left !important;
        }
        .r15-o {
          border-style: solid !important;
          margin: 0 0 0 auto !important;
          width: 100% !important;
        }
        .r16-i {
          padding: 0 !important;
          text-align: center !important;
        }
        .r17-r {
          background-color: #2b89cf !important;
          border-color: #000000 !important;
          border-radius: 4px !important;
          border-width: 0px !important;
          box-sizing: border-box;
          height: initial !important;
          padding: 0 !important;
          padding-bottom: 6px !important;
          padding-left: 5px !important;
          padding-right: 5px !important;
          padding-top: 6px !important;
          text-align: center !important;
          width: 100% !important;
        }
        body {
          -webkit-text-size-adjust: none;
        }
        .nl2go-responsive-hide {
          display: none;
        }
        .nl2go-body-table {
          min-width: unset !important;
        }
        .mobshow {
          height: auto !important;
          overflow: visible !important;
          max-height: unset !important;
          visibility: visible !important;
          border: none !important;
        }
        .resp-table {
          display: inline-table !important;
        }
        .magic-resp {
          display: table-cell !important;
        }
      }
    </style>
    <style type="text/css">
      p,
      h1,
      h2,
      h3,
      h4,
      ol,
      ul,
      li {
        margin: 0;
      }
      a,
      a:link {
        color: #0092ff;
        text-decoration: underline;
      }
      .nl2go-default-textstyle {
        color: #3b3f44;
        font-family: arial, helvetica, sans-serif;
        font-size: 16px;
        line-height: 1.2;
        word-break: break-word;
      }
      .default-button {
        color: #ffffff;
        font-family: arial, helvetica, sans-serif;
        font-size: 16px;
        font-style: normal;
        font-weight: normal;
        line-height: 1.15;
        text-decoration: none;
        word-break: break-word;
      }
      .default-heading3 {
        color: #1f2d3d;
        font-family: arial, helvetica, sans-serif;
        font-size: 24px;
        word-break: break-word;
      }
      .default-heading4 {
        color: #1f2d3d;
        font-family: arial, helvetica, sans-serif;
        font-size: 18px;
        word-break: break-word;
      }
      .default-heading1 {
        color: #1f2d3d;
        font-family: arial, helvetica, sans-serif;
        font-size: 36px;
        word-break: break-word;
      }
      .default-heading2 {
        color: #1f2d3d;
        font-family: arial, helvetica, sans-serif;
        font-size: 32px;
        word-break: break-word;
      }
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: inherit !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }
      .no-show-for-you {
        border: none;
        display: none;
        float: none;
        font-size: 0;
        height: 0;
        line-height: 0;
        max-height: 0;
        mso-hide: all;
        overflow: hidden;
        table-layout: fixed;
        visibility: hidden;
        width: 0;
      }
    </style>
    <!--[if mso
      ]><xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG /> <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml><!
    [endif]-->
    <style type="text/css">
      a:link {
        color: #0092ff;
        text-decoration: underline;
      }
    </style>
  </head>
  <body
    bgcolor="#f9fafc"
    text="#3b3f44"
    link="#0092ff"
    yahoo="fix"
    style="background-color: #f9fafc; padding-top: 38px"
  >
    <table
      cellspacing="0"
      cellpadding="0"
      border="0"
      role="presentation"
      class="nl2go-body-table"
      width="100%"
      style="background-color: #f9fafc; width: 100%"
    >
      <tr>
        <td>
          <table
            cellspacing="0"
            cellpadding="0"
            border="0"
            role="presentation"
            width="590"
            align="center"
            class="r0-o"
            style="table-layout: fixed; width: 590px"
          >
            <tr>
              <td valign="top" class="r1-i" style="background-color: #f9fafc">
                <table
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  role="presentation"
                  width="100%"
                  align="center"
                  class="r3-o"
                  style="table-layout: fixed; width: 100%"
                >
                  <tr>
                    <td
                      class="r4-i"
                      style="
                        background-color: #ffffff;
                        padding-bottom: 20px;
                        padding-left: 20px;
                        padding-right: 20px;
                        padding-top: 20px;
                      "
                    >
                      <table
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        role="presentation"
                      >
                        <tr>
                          <th
                            width="100%"
                            valign="top"
                            class="r5-c"
                            style="font-weight: normal"
                          >
                            <table
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                              role="presentation"
                              width="100%"
                              class="r6-o"
                              style="table-layout: fixed; width: 100%"
                            >
                              <tr>
                                <td
                                  valign="top"
                                  class="r7-i"
                                  style="padding-left: 5px; padding-right: 5px"
                                >
                                  <table
                                    width="100%"
                                    cellspacing="0"
                                    cellpadding="0"
                                    border="0"
                                    role="presentation"
                                  >
                                    <tr>
                                      <td class="r8-c" align="left">
                                        <table
                                          cellspacing="0"
                                          cellpadding="0"
                                          border="0"
                                          role="presentation"
                                          width="550"
                                          class="r9-o"
                                          style="
                                            table-layout: fixed;
                                            width: 550px;
                                          "
                                        >
                                          <tr>
                                            <td class="r10-i">
                                              <a
                                                href="https://adresse.data.gouv.fr/"
                                                target="_blank"
                                                style="
                                                  color: #0092ff;
                                                  text-decoration: underline;
                                                "
                                              >
                                                <img
                                                  src="https://img.mailinblue.com/2265896/images/rnb/original/63c02a863be92f0fb24630a9.jpg?t=1675237590354"
                                                  width="550"
                                                  alt="Charte de la Base Adresse Locale"
                                                  border="0"
                                                  style="
                                                    display: block;
                                                    width: 100%;
                                                  "
                                              /></a>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </th>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table
            cellspacing="0"
            cellpadding="0"
            border="0"
            role="presentation"
            width="100%"
            align="center"
            class="r3-o"
            style="table-layout: fixed; width: 100%"
          >
            <tr>
              <td valign="top" class="r1-i" style="background-color: #f9fafc">
                <table
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  role="presentation"
                  width="590"
                  align="center"
                  class="r0-o"
                  style="table-layout: fixed; width: 590px"
                >
                  <tr>
                    <th
                      width="100%"
                      valign="top"
                      class="r5-c"
                      style="font-weight: normal"
                    >
                      <table
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        role="presentation"
                        width="590"
                        align="center"
                        class="r3-o"
                        style="table-layout: fixed; width: 590px"
                      >
                        <tr>
                          <td
                            height="20"
                            class="r11-i"
                            style="
                              font-size: 20px;
                              line-height: 20px;
                              background-color: transparent;
                            "
                          >
                            ­
                          </td>
                        </tr>
                      </table>
                    </th>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table
            cellspacing="0"
            cellpadding="0"
            border="0"
            role="presentation"
            width="590"
            align="center"
            class="r0-o"
            style="table-layout: fixed; width: 590px"
          >
            <tr>
              <td valign="top" class="r1-i" style="background-color: #f9fafc">
                <table
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  role="presentation"
                  width="100%"
                  align="center"
                  class="r3-o"
                  style="table-layout: fixed; width: 100%"
                >
                  <tr>
                    <td
                      class="r12-i"
                      style="
                        background-color: #ffffff;
                        padding-left: 20px;
                        padding-right: 20px;
                      "
                    >
                      <table
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        role="presentation"
                      >
                        <tr>
                          <th
                            width="100%"
                            valign="top"
                            class="r5-c"
                            style="font-weight: normal"
                          >
                            <table
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                              role="presentation"
                              width="100%"
                              class="r6-o"
                              style="table-layout: fixed; width: 100%"
                            >
                              <tr>
                                <td
                                  valign="top"
                                  class="r7-i"
                                  style="padding-left: 5px; padding-right: 5px"
                                >
                                  <table
                                    width="100%"
                                    cellspacing="0"
                                    cellpadding="0"
                                    border="0"
                                    role="presentation"
                                  >
                                    <tr>
                                      <td class="r8-c" align="left">
                                        <table
                                          cellspacing="0"
                                          cellpadding="0"
                                          border="0"
                                          role="presentation"
                                          width="100%"
                                          class="r9-o"
                                          style="
                                            table-layout: fixed;
                                            width: 100%;
                                          "
                                        >
                                          <tr>
                                            <td
                                              align="center"
                                              valign="top"
                                              class="r13-i nl2go-default-textstyle"
                                              style="
                                                color: #3b3f44;
                                                font-family: arial, helvetica,
                                                  sans-serif;
                                                font-size: 16px;
                                                line-height: 1.2;
                                                word-break: break-word;
                                                padding-bottom: 10px;
                                                padding-top: 10px;
                                                text-align: center;
                                              "
                                            >
                                              <div>
                                                <p
                                                  style="
                                                    margin: 0;
                                                    font-family: 'Marianne',
                                                      'Arial', Helvetica,
                                                      sans-serif;
                                                    font-size: 24px;
                                                    color: #3c4858;
                                                  "
                                                >
                                                  <span style="font-size: 20px"
                                                    ><strong
                                                      >Signalement d'un problème d'adressage - ${subject}
                                                    </strong></span
                                                  >
                                                </p>
                                              </div>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </th>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <table
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  role="presentation"
                  width="100%"
                  align="center"
                  class="r3-o"
                  style="table-layout: fixed; width: 100%"
                >
                  <tr>
                    <td
                      class="r4-i"
                      style="
                        background-color: #ffffff;
                        padding-bottom: 20px;
                        padding-left: 20px;
                        padding-right: 20px;
                        padding-top: 20px;
                      "
                    >
                      <table
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        role="presentation"
                      >
                        <tr>
                          <th
                            width="100%"
                            valign="top"
                            class="r5-c"
                            style="font-weight: normal"
                          >
                            <table
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                              role="presentation"
                              width="100%"
                              align="left"
                              class="r9-o"
                              style="table-layout: fixed; width: 100%"
                            >
                              <tr>
                                <td
                                  align="left"
                                  valign="top"
                                  class="r14-i nl2go-default-textstyle"
                                  style="
                                    color: #3b3f44;
                                    font-family: arial, helvetica, sans-serif;
                                    font-size: 16px;
                                    line-height: 1.2;
                                    word-break: break-word;
                                    text-align: left;
                                  "
                                >
                                  <div>
                                    <p
                                      style="
                                        margin: 0;
                                        color: #3c4858;
                                        font-family: 'Marianne', 'Arial',
                                          Helvetica, sans-serif;
                                        font-size: 14px;
                                      "
                                    >
                                      <span
                                        style="
                                          font-family: Arial, helvetica,
                                            sans-serif;
                                          font-size: 14px;
                                        "
                                        >Bonjour,</span
                                      >
                                      <br />
                                      <br />
                                      <p style="
                                      font-family: Arial, helvetica,
                                        sans-serif;
                                      font-size: 14px;
                                    ">Nous vous contactons suite à la demande de l'un de vos administrés dont l'adresse ne remonte pas dans la Base Adresse Nationale.</p>
                                      <br />
                                      <p style="
                                      font-family: Arial, helvetica,
                                        sans-serif;
                                      font-size: 14px;
                                    ">Voici le détail de son signalement ainsi que ses coordonnées afin que vous puissiez prendre contact avec lui :</p>
                                      <br />
                                      <p style="
                                      font-family: Arial, helvetica,
                                        sans-serif;
                                      font-size: 14px;
                                    ">Objet du signalement : <b>${subject}</b></p>
                                      ${
                                        street
                                          ? `<p style="
                                          font-family: Arial, helvetica,
                                            sans-serif;
                                          font-size: 14px;
                                        ">Voie : <b>${street}</b></p>`
                                          : ""
                                      }
                                      ${
                                        number
                                          ? `<p style="
                                          font-family: Arial, helvetica,
                                            sans-serif;
                                          font-size: 14px;
                                        ">Numéro : <b>${number}</b></p>`
                                          : ""
                                      }
                                      ${
                                        message
                                          ? `<p style="
                                          font-family: Arial, helvetica,
                                            sans-serif;
                                          font-size: 14px;
                                        ">Message : <em>${message}</em></p>`
                                          : ""
                                      }
                                      ${
                                        firstName || lastName
                                          ? `<p style="
                                          font-family: Arial, helvetica,
                                            sans-serif;
                                          font-size: 14px;
                                        ">Coordonnées du demandeur : <b>${firstName} ${lastName}</b>`
                                          : ""
                                      }
                                      <p style="
                                      font-family: Arial, helvetica,
                                        sans-serif;
                                      font-size: 14px;
                                    ">Email du demandeur : <b>${email}</b></p>
                                      <br />
                                      ${
                                        publication.client === "Mes Adresses"
                                          ? `<p style="
                                          font-family: Arial, helvetica,
                                            sans-serif;
                                          font-size: 14px;
                                        ">Afin de prendre en compte ce signalement, vous pouvez vous rendre sur le site <a href="https://mes-adresses.data.gouv.fr" target="_blank">mes-adresses.data.gouv.fr</a> sur la page de la Base Adresse Locale de votre <a href="https://mes-adresses.data.gouv.fr/bal/${publication.balId}" target="_blank">commune</a>.</p>`
                                          : publication.client ===
                                              "Moissonneur BAL"
                                            ? `<p style="
                                            font-family: Arial, helvetica,
                                              sans-serif;
                                            font-size: 14px;
                                          ">Afin de prendre en compte ce signalement, vous pouvez vous rapprocher de l'organisation <b>${publication.organization}</b> qui gère la publication de la Base Adresse Locale de votre commune.</p>`
                                            : publication.client
                                              ? `<p style="
                                              font-family: Arial, helvetica,
                                                sans-serif;
                                              font-size: 14px;
                                            ">Afin de prendre en compte ce signalement, vous pouvez vous rapprocher de l'organisation <b>${publication.client}</b> qui gère la publication de la Base Adresse Locale de votre commune.</p>`
                                              : `<p style="
                                              font-family: Arial, helvetica,
                                                sans-serif;
                                              font-size: 14px;
                                            ">Vous pouvez prendre en compte ce signalement en vous rendant sur le site <a href="https://mes-adresses.data.gouv.fr" target="_blank">mes-adresses.data.gouv.fr</a> et en créant une Base Adresse Locale pour votre commune. Pour vous aider dans cette démarche, vous pouvez consulter cet <a href="https://guide.mes-adresses.data.gouv.fr/creeer-une-base-adresse-locale/creer-une-nouvelle-base-adresse-locale" target="_blank">article</a> qui explique les étapes de la création d'une Base Adresse Locale. Vous trouverez aussi de la documentation et des tutoriels vidéos directement sur le site <a href="https://mes-adresses.data.gouv.fr" target="_blank">mes-adresses.data.gouv.fr</a>. Enfin, vous pouvez vous inscrire pour suivre un de nos webinaires sur la prise en main de l'outil sur cette <a href="https://adresse.data.gouv.fr/evenements" target="_blank">page</a>.</p>`
                                      }
                                      <br />
                                      <p style="
                                      font-family: Arial, helvetica,
                                        sans-serif;
                                      font-size: 14px;
                                    ">Ceci est un message automatique, mais vous pouvez nous contacter via l'email <b>adresse@data.gouv.fr</b> pour obtenir des informations complémentaires.</p>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </th>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <table
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  role="presentation"
                  width="100%"
                  align="center"
                  class="r3-o"
                  style="table-layout: fixed; width: 100%"
                >
                  <tr>
                    <td
                      class="r4-i"
                      style="
                        background-color: #ffffff;
                        padding-bottom: 20px;
                        padding-left: 20px;
                        padding-right: 20px;
                        padding-top: 20px;
                      "
                    >
                      <table
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        role="presentation"
                      >
                        <tr>
                          <th
                            width="100%"
                            valign="top"
                            class="r5-c"
                            style="font-weight: normal"
                          >
                            <table
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                              role="presentation"
                              width="100%"
                              align="left"
                              class="r9-o"
                              style="table-layout: fixed; width: 100%"
                            >
                              <tr>
                                <td
                                  align="left"
                                  valign="top"
                                  class="r14-i nl2go-default-textstyle"
                                  style="
                                    color: #3b3f44;
                                    font-family: arial, helvetica, sans-serif;
                                    font-size: 16px;
                                    line-height: 1.2;
                                    word-break: break-word;
                                    text-align: left;
                                  "
                                >
                                  <div>
                                    <p
                                      style="
                                        margin: 0;
                                        font-family: 'Marianne', 'Arial',
                                          Helvetica, sans-serif;
                                        font-size: 14px;
                                        color: #3c4858;
                                      "
                                    >
                                      <span
                                        >Cordialement,<br /><br /><em
                                          >L’équipe
                                          <a
                                            href="https://adresse.data.gouv.fr/"
                                            style="
                                              color: #0092ff;
                                              text-decoration: underline;
                                            "
                                            ><span
                                              style="
                                                text-decoration: underline;
                                                color: rgb(43, 137, 207);
                                              "
                                              >adresse.data.gouv.fr</span
                                            ></a
                                          ></em
                                        ></span
                                      >
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </th>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
