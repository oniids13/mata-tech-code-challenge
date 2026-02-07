const { Pool } = require("pg");

async function dbPlugin(fastify) {
  const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "Asakapa00",
    database: "mata_tech",
  });

  fastify.decorate("db", pool);

  fastify.addHook("onClose", async () => {
    await pool.end();
  });
}

module.exports = dbPlugin;
