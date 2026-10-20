// Runs the Apidog suite. ReqRes needs a free API key for write calls (POST/PUT/PATCH/DELETE),
// so the key is read from the REQRES_API_KEY environment variable and never stored in the repo.
const { spawnSync } = require("node:child_process");

const apiKey = process.env.REQRES_API_KEY;
if (!apiKey) {
  console.error(
    [
      "REQRES_API_KEY is not set.",
      "Get a free key at https://app.reqres.in/api-keys and run:",
      "  macOS/Linux:  REQRES_API_KEY=<your-key> npm test",
      "  PowerShell:   $env:REQRES_API_KEY='<your-key>'; npm test",
    ].join("\n"),
  );
  process.exit(2);
}

const result = spawnSync(
  "npx",
  [
    "apidog",
    "run",
    "tests/reqres-full-suite.apidog-cli.json",
    "--env-var",
    `apiKey=${apiKey}`,
    "-r",
    "cli,html,junit",
    "--out-dir",
    "reports",
  ],
  { stdio: "inherit", shell: process.platform === "win32" },
);

process.exit(result.status ?? 1);
