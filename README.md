# Bal admin

Back office et permet d'administrer mes-adresses-api, moissoneur et api-depot.

## 📚 Documentation

Une documentation plus complète et des guides d’utilisation sont disponibles dans le [Wiki](https://github.com/BaseAdresseNationale/bal-admin/wiki).

## Pré-requis

- [Node.js](https://nodejs.org) 22
- [yarn](https://www.yarnpkg.com)
- [PostgresSQL](https://www.postgresql.org/)

## Utilisation

### Installation

Installation des dépendances Node.js

```
$ yarn
```

### Développement

Lancer le serveur de développement :

```
$ yarn dev
```

### Production

Créer une version de production :

```
$ yarn build
```

Démarrer le serveur (port 9000 par défaut) :

```
$ yarn start
```

### Linter

Rapport du linter (eslint) :

```
$ yarn lint
```

## Configuration

Cette application utilise des variables d'environnement pour sa configuration.
Elles peuvent être définies classiquement ou en créant un fichier `.env` sur la base du modèle `.env.sample`.

| Nom de la variable                | Description                                                          |
| --------------------------------- | -------------------------------------------------------------------- |
| `NEXT_PUBLIC_BAL_ADMIN_URL`       | URL de base de bal admin                                             |
| `NEXT_PUBLIC_API_MOISSONEUR_BAL`  | URL de base de l'api du moissonneur                                  |
| `NEXT_PUBLIC_API_MES_ADRESSES`    | URL de base de mes-adresses-api                                      |
| `NEXT_PUBLIC_MES_ADRESSES_URL`    | URL de base de mes-adresses                                          |
| `NEXT_PUBLIC_API_DEPOT_URL`       | URL de base de l'api de depot                                        |
| `NEXT_PUBLIC_API_DEPOT_DEMO_URL`  | URL de base de l'api de depot demo                                   |
| `NEXT_PUBLIC_BAL_WIDGET_URL`      | URL de base du Bal widget                                            |
| `NEXT_PUBLIC_API_SIGNALEMENT_URL` | URL de base de l'API Signalement                                     |
| ---                               | ---                                                                  |
| `POSTGRES_URL`                    | Paramètre de connexion à Postgres                                    |
| `PORT`                            | Port à utiliser pour l'API                                           |
| `API_MOISSONEUR_BAL_TOKEN`        | TOKEN admin du moissoneur                                            |
| `API_DEPOT_TOKEN`                 | TOKEN admin de l'api de depot                                        |
| `API_DEPOT_DEMO_TOKEN`            | TOKEN admin de l'api de depot demo                                   |
| `API_MES_ADDRESSES_TOKEN`         | TOKEN admin de mes-adresses-api                                      |
| `API_SIGNALEMENT_TOKEN`           | TOKEN admin de l'api-signalement                                     |
| `HCAPTCHA_SECRET_KEY`             | Clef secrete du captcha                                              |
| ---                               | ---                                                                  |
| `SMTP_HOST`                       | Nom d'hôte du serveur SMTP                                           |
| `SMTP_PORT`                       | Port du serveur SMTP                                                 |
| `SMTP_USER`                       | Nom d'utilisateur pour se connecter au serveur SMTP                  |
| `SMTP_PASS`                       | Mot de passe pour se connecter au serveur SMTP                       |
| `SMTP_SECURE`                     | Indique si le serveur SMTP nécessite une connexion sécurisée (`YES`) |
| `SMTP_FROM`                       | Adresse à utiliser en tant qu'expéditeur des emails                  |
| ---                               | ---                                                                  |
| `KEYCLOAK_ISSUER`                 | Isseur du keycloack                                                  |
| `KEYCLOAK_CLIENT_ID`              | Id du client Keycloack                                               |
| `KEYCLOAK_CLIENT_SECRET`          | Secret du client Keyclack                                            |
| `NEXTAUTH_URL`                    | Url de connection NextJs                                             |
| `NEXTAUTH_SECRET`                 | Secret de connection NextJs                                          |

Toutes ces variables ont des valeurs par défaut que vous trouverez dans le fichier `.env.sample`.
