# To-do list app with GraphQL API

## Team Members

- Lê Anh Kiệt - 20127542
- Hoàng Quốc Nam - 20127566
- Lê Duy Tâm - 20127619

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/en/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Tech stack

#### Client

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [Chakra UI](https://chakra-ui.com/)
- [React Router](https://reactrouter.com/)
- [React Hook Form](https://react-hook-form.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Typescript](https://www.typescriptlang.org/)

#### Server

- [Node.js](https://nodejs.org/en/)
- [NestJS](https://nestjs.com/)
- [Express](https://expressjs.com/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [pgAdmin4](https://www.pgadmin.org/)
- [Typescript](https://www.typescriptlang.org/)

### Implemented features

- [x] Authenticate with JWT (login, register, logout)
- [x] CRUD to do lists
- [x] CRUD tasks

### How to run

**Note:** Make sure you run the following commands in the root directory of the project.

#### Client

**Host:** http://localhost:3000

**Commands to run:**

```bash
cd client
yarn install
yarn dev
```

#### Server

**Host:** http://localhost:8080

**GraphQL API:** http://localhost:8080/graphql

**pgAdmin4:** http://localhost:5050

**Commands to run:**

```bash
cd server
yarn install
docker compose up -d
```

**Commands to stop:**

```bash
docker compose down
```

**Commands to logs:**

```bash
# log server logs
docker logs server -f

# log database logs
docker logs db -f

# log pgadmin4 logs
docker logs pgadmin4 -f

# log all logs
docker compose logs -f
```
