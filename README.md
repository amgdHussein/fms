# Financial Management System

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository for **FMS** backend project.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## License

Nest is [MIT licensed](LICENSE).

## Source Folder Structure

```
  src
  │
  ├── core
  │   │
  │   ├── configs
  │   ├── constants
  │   ├── shared
  │   │   ├── dtos
  │   │   ├── entities
  │   │   ├── exceptions/ errors
  │   │   └── ...
  │   │
  │   ├── decorators
  │   ├── providers
  │   ├── guards
  │   ├── middlewares
  │   ├── pipes/ validators: transformation, validation
  │   ├── interceptors
  │   │   ├── logger (debugging)
  │   │   ├── response
  │   │   └── ...
  │   │
  │   └── filters
  │       ├── http exceptions
  │       └── ...
  │
  └── modules
      │
      ├── organization
      │   │
      │   ├── domain
      │   │   ├── entities: schema (interface)
      │   │   ├── repositories: logic (abstract class)
      │   │   └── usecases: trigger of the repository specific function
      │   │
      │   ├── infrastructure
      │   │   ├── repositories: the implementation of abstracted repos
      │   │   ├── datasources: incase of multiple datasource db/ cache/ ...
      │   │   └── services: business logic actual implementation
      │   │
      │   └── presentation
      │       ├── controllers/ route-handler
      │       └── dtos/ presenters/ view-models
      │
      ├── report
      │
      └── ...
```
