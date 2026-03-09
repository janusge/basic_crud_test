# Aplicación web desarrollada con FastAPI para el backend, ReactJS para el frontend y PostgreSQL para la base de datos. Este repositorio es el entregable de una prueba técnica.

Instrucciones de Despliegue

   1. Clonar el repositorio:
   
   `git clone git@github.com:janusge/basic_crud_test.git`

   `cd basic_crud_test`
   
   2. Despliegue completo con Docker Swarm:
   
   `docker swarm init`

   `docker compose build`
   
   `docker stack deploy -c docker-compose.yml app_stack`
   
   3. Despliegue independiente (Docker Compose):
   * Solo Frontend:
      
      `docker compose -f docker-compose.frontend.yml up --build`
      
      * Solo Backend:
      
      `docker compose -f docker-compose.backend.yml up --build`
      
      
Acceso: Una vez levantados los contenedores, ingresa a http://localhost:5173/ para registrar un usuario e iniciar sesión.

------------------------------
# Desarrollo Backend
Para el desarrollo backend se utilizó la distribución de archivos básica de FastAPI, con la siguiente separación de código:

* auth.py: Contiene la lógica de autorización por medio de tokens JWT, creación de tokens y verificación de los mismos.
* database.py: Contiene la lógica de conexión a la base de datos usando el framework SQLAlchemy.
* JWTBearer.py: Archivo con la lógica de seguridad para proteger los endpoints de usuarios no autenticados. Se diseñó para inyectarse como dependencia.
* main.py: Punto de entrada de la aplicación con configuración de CORS y carga de rutas.
* models.py: Definición de los modelos de SQLAlchemy para las tablas de la base de datos.
* schemas.py: Definiciones de esquemas Pydantic (JSON) para validación de datos de entrada y salida.
* utils.py: Configuraciones adicionales para la generación de tokens.

## Estructura de Carpetas

* router/: Lógica de los endpoints dividida en:
* users.py: Endpoints de usuarios.
   * joke.py: Endpoints de las bromas.
* infrastructure/http/: Cliente HTTP básico para peticiones externas. Utiliza una clase abstracta para implementar Dependency Inversion.
* application/: Lógica de los casos de uso:
* joke.py: Servicio de petición a la API de bromas.
   * users.py: Lógica de negocio para usuarios.

------------------------------
## Endpoints Disponibles

| Método | Endpoint | Seguridad | Descripción |
|---|---|---|---|
| GET | /users/ | Bearer Token | Lista de usuarios. |
| GET | /users/{user_id} | Bearer Token | Detalle de un usuario. |
| POST | /users | Pública | Registro de usuario. |
| POST | /users/login | Pública | Login y obtención de JWT. |
| POST | /users/verify-token/{token} | Pública | Verifica validez del token. |
| PUT | /users/{user_id} | Bearer Token | Actualiza usuario. |
| DELETE | /users/{user_id} | Bearer Token | Borra usuario. |
| GET | /external/joke | Pública | Obtiene broma externa. |

------------------------------
# Desarrollo Frontend

Se utilizó Vite para la creación del proyecto. Se agregaron los siguientes elementos:

### Componentes React

* Joke.jsx: Visualización de bromas.
* Login.jsx: Formulario de inicio de sesión.
* Register.jsx: Formulario de registro.
* Users.jsx: CRUD de usuarios (lista, detalles, edición y borrado).

Carpeta service

* auth.js: Lógica de autenticación JWT.
* joke.js: Comunicación con el endpoint de bromas.
* user.js: Consumo de la API de usuarios.



