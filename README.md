# ReqRes API Automation (Apidog CLI + GitHub Actions)

[![API Tests](https://github.com/AbdelrahmanGamal1998/reqres-api-automation-apidog/actions/workflows/api-tests.yml/badge.svg)](https://github.com/AbdelrahmanGamal1998/reqres-api-automation-apidog/actions/workflows/api-tests.yml)

Automated API test suite for the public [ReqRes](https://reqres.in) API. It covers authentication and the
full user CRUD flow, runs from the command line with the **Apidog CLI**, produces HTML and JUnit reports,
and runs on every push through **GitHub Actions**. The API is described in an OpenAPI 3 spec that is
linted in CI.

## What is tested

9 requests and 24 assertions, run in order. Values such as the login token and the first user id are
passed from one request to the next.

| #   | Request                                      | What it checks                                      |
| --- | -------------------------------------------- | --------------------------------------------------- |
| 01  | `POST /login` with valid credentials         | 200, response time, token returned and stored       |
| 02  | `POST /login` without a password             | 400 and the "Missing password" error               |
| 03  | `GET /users?page=1`                          | 200, pagination fields, user fields                 |
| 04  | `GET /users/{id}`                            | 200, id matches the one from the list, email format |
| 05  | `GET /users/999`                             | 404 and an empty body                               |
| 06  | `POST /users`                                | 201, `id` and `createdAt` returned                  |
| 07  | `PUT /users/2`                               | 200, `updatedAt` present, job updated               |
| 08  | `PATCH /users/2`                             | 200, `updatedAt` present                            |
| 09  | `DELETE /users/2`                            | 204 and an empty body                               |

## Run it locally

You need Node.js 18 or newer and a free ReqRes API key (ReqRes requires a key for write requests).
Get one at <https://app.reqres.in/api-keys>.

```bash
git clone https://github.com/AbdelrahmanGamal1998/reqres-api-automation-apidog.git
cd reqres-api-automation-apidog
npm install
```

Run the tests with your key in the `REQRES_API_KEY` environment variable:

```bash
# macOS / Linux
REQRES_API_KEY=<your-key> npm test

# Windows PowerShell
$env:REQRES_API_KEY='<your-key>'; npm test
```

The command prints the results in the terminal and writes an HTML and a JUnit report to `reports/`.
Without the key it stops with a message that tells you what to do.

Other commands:

```bash
npm run lint:spec      # validate apis/openapi.yaml with Redocly
npm run preview:spec   # open the API docs in the browser
```

## Continuous integration

`.github/workflows/api-tests.yml` runs on every push and pull request:

1. **Validate** lints `apis/openapi.yaml`.
2. **Test** runs the suite, uploads the HTML report as an artifact and publishes the JUnit results to the
   run summary.

To enable the test job, add your key as a repository secret named `REQRES_API_KEY`
(Settings, Secrets and variables, Actions). Without the secret the test job is skipped and says so.

## Project structure

```
apis/
  openapi.yaml                       OpenAPI 3 description of the endpoints under test
  collection.json                    Postman-style collection, to import into Postman or Apidog
environments/
  local.json, production.json        Environment variables for the collection above
tests/
  reqres-full-suite.apidog-cli.json  The test suite that `npm test` runs (Apidog CLI format)
scripts/
  run-tests.js                       Runs the suite and reads the key from REQRES_API_KEY
.github/workflows/api-tests.yml      CI pipeline
```

## Notes

- The login account (`eve.holt@reqres.in` / `cityslicka`) is ReqRes's public demo account.
- Never commit your API key. It is passed in through the environment, and `.env` files are git-ignored.
- ReqRes does not really change data: write requests return realistic responses but nothing is stored,
  so the suite can run repeatedly.

## License

[MIT](LICENSE)
