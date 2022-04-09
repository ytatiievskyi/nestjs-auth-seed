## TODO:
- refresh token functionality
- logout method, revoke used tokens
- unit and integrational tests
- user input validation
- use cookies instead of Authorization header

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## GraphQL
to access graphql sandbox in development mode, open in browser {url}/graphql

Example: http://localhost:3000/graphql


#Request examples
##Auth flow
###Register
```
mutation {
  register(credentials: {
    email: "testemailregistra@mailforspam.com",
    password: "password"
    username: "test",
    about: "test",
  })
}

```
Check the email to proceed.
Example:
http://localhost:3000/auth/verify?token=token

###Log in
```
mutation {
  login(credentials: {
    email: "testemailregistra@mailforspam.com",
    password: "password",
  }) {
    access
  }
}
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```