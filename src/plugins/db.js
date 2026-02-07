require("dotenv").config();

const { Pool } = require("pg");

async function dbPlugin(fastify) {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  fastify.decorate("db", pool);

  fastify.addHook("onClose", async () => {
    await pool.end();
  });
}

module.exports = dbPlugin;
