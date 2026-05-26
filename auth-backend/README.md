# auth-backend

## Local runtime

- Profile: `dev`
- Server port: `8083`
- Database schema: `auth_app_db`
- MySQL URL: `jdbc:mysql://localhost:3307/auth_app_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC`

## IntelliJ environment variables

```text
SPRING_PROFILES_ACTIVE=dev
DB_URL=jdbc:mysql://localhost:3307/auth_app_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=root
```

## Google OAuth callback


```text
http://localhost:8083/login/oauth2/code/google
```

