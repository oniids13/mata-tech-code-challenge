const fastify = require("fastify")({
  logger: true,
});

fastify.get("/", async (request, reply) => {
  return { message: "Fastify backend running 🚀" };
});

fastify.listen({ port: 3000 });
