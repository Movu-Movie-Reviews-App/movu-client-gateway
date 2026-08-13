# Client Gateway

HTTP API gateway for the Movu platform. This is the only service in the stack exposed over HTTP — it terminates client requests, applies authentication/validation, and fans them out to the internal microservices over NATS.

## Tech stack

- [NestJS](https://nestjs.com/) 11 (HTTP)
- [NATS](https://nats.io/) transport (`@nestjs/microservices`) for internal service calls
- [Passport](https://www.passportjs.org/) + JWT for request authentication
- `class-validator` / `class-transformer` for DTO validation
- `Joi` for environment variable validation

## Architecture

The gateway holds no database and no business logic of its own — every route validates and forwards the request to the owning microservice over NATS, then relays the response.

```
                         ┌──> auth-service
Client  --(HTTP/api)-->  gateway  ──(NATS)──┼──> content-service
                         └──> review-service
                             └──> user-service
```

All routes are mounted under the `/api` prefix and use a global `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`, `transform`).

## HTTP endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate and receive a JWT |
| `GET` | `/api/content` | List content (movies + series) |
| `GET` | `/api/content/search` | Search content |
| `GET` | `/api/content/top-rated-week` | Top-rated content for the current week |
| `GET` | `/api/content/home` | Aggregated home feed (content + favorites/wishlist when authenticated) |
| `GET` | `/api/movies/:id` | Movie details |
| `GET` | `/api/series/:id` | Series details |
| `GET` | `/api/genres` | List genres |
| `GET` | `/api/review/:contentId` | List reviews for a piece of content |
| `GET` | `/api/review/:contentId/my-review` | Current user's review for a piece of content |
| `POST` | `/api/review` | Create a review |
| `PATCH` | `/api/review/:id` | Update a review |
| `DELETE` | `/api/review/:id` | Delete a review |
| `GET` | `/api/users` | List users |
| `GET` | `/api/users/:id` | Get a user |
| `POST` | `/api/users` | Create a user |
| `PATCH` | `/api/users/:id` | Update a user |
| `DELETE` | `/api/users/:id` | Delete a user |
| `GET` | `/api/favorite` | List current user's favorites |
| `POST` | `/api/favorite` | Add a favorite |
| `GET` | `/api/favorite/:contentId` | Get a specific favorite |
| `DELETE` | `/api/favorite/:contentId` | Remove a favorite |
| `GET` | `/api/wishlist` | List current user's wishlist |
| `POST` | `/api/wishlist` | Add to wishlist |
| `GET` | `/api/wishlist/:contentId` | Get a specific wishlist entry |
| `DELETE` | `/api/wishlist/:contentId` | Remove from wishlist |
| `POST` | `/api/tmdb-sync` | Trigger a full TMDB sync |
| `POST` | `/api/tmdb-sync/movie-genres` | Sync movie genres from TMDB |
| `POST` | `/api/tmdb-sync/series-genres` | Sync series genres from TMDB |
| `POST` | `/api/tmdb-sync/popular-movies` | Sync popular movies from TMDB |
| `POST` | `/api/tmdb-sync/popular-series` | Sync popular series from TMDB |
| `GET` | `/api/tmdb-sync/clear` | Clear synced content |

Routes marked with a user context (favorites, wishlist, reviews, home feed) resolve the current user from the JWT via the `@GetUserId()` decorator; some support optional authentication.

## Requirements

- Node.js 21+
- Docker & Docker Compose (recommended)
- A running NATS server and the upstream microservices this gateway talks to

## Environment variables

Configuration is validated in `src/config/envs.ts`. When run via the root `docker-compose.yml`, these are supplied automatically from the repo-level `.env` file.

| Variable | Description |
|---|---|
| `PORT` | HTTP port the gateway listens on |
| `NATS_SERVERS` | Comma-separated list of NATS server URLs |
| `CORS_ORIGINS` | Comma-separated list of allowed browser origins |

## Running the service

### With Docker Compose (recommended)

From the repository root:

```bash
cp .env.template .env
# fill in the required values in .env
docker compose up
```

The gateway will be reachable at `http://localhost:${CLIENT_GATEWAY_PORT}/api`.

### Standalone (local development)

```bash
npm install
```

Create a `.env` file in this directory with the variables listed above, then:

```bash
npm run start:dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run start` | Start the service |
| `npm run start:dev` | Start in watch mode |
| `npm run start:debug` | Start in watch mode with the debugger attached |
| `npm run start:prod` | Run the compiled build (`dist/main`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run lint` | Lint and auto-fix source files |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:cov` | Run tests with coverage report |

## Project structure

```
src/
├── auth/          # Login/register routes, JWT strategy, guards, decorators
├── content/        # Content listing/search/home feed routes
├── movie/           # Movie detail routes
├── series/           # Series detail routes
├── genres/            # Genre listing routes
├── review/             # Review CRUD routes
├── users/               # User CRUD routes
├── favorite/              # Favorites routes
├── wishlist/                # Wishlist routes
├── tmdb-sync/                 # TMDB sync trigger routes
├── transport/                   # Shared NATS client module
├── common/                        # Shared DTOs, enums, exception filters
├── config/                         # Environment variable validation
├── app.module.ts
└── main.ts
```
