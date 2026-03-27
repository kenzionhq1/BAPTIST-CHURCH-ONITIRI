const { env } = require("./src/config/env");
const { connectDb } = require("./src/config/db");
const { createApp } = require("./src/app");

async function start() {
  await connectDb();

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    console.log(`API listening on port ${env.PORT}`);
  });

  function shutdown(signal) {
    console.log(`\nReceived ${signal}. Shutting down...`);
    server.close(() => process.exit(0));
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
