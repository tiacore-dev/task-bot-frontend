const fs = require("fs");

const apiUrl = process.env.API_URL || "https://default-api-url.com";

const envContent = `window.env = { API_URL: "${apiUrl}" };`;

fs.writeFileSync("frontend/env.js", envContent, { encoding: "utf8" });

console.log(`✅ env.js сгенерирован: API_URL = ${apiUrl}`);
