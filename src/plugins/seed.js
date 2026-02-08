require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
});

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    await pool.query("DELETE FROM sales");
    await pool.query("DELETE FROM products");
    await pool.query("DELETE FROM users");

    // Seed users
    const usersResult = await pool.query(`
      INSERT INTO users (name, email, password)
      VALUES
        ('Juan Dela Cruz', 'juan@example.com', 'testpassword'),
        ('Maria Santos', 'maria@example.com', 'testpassword'),
        ('Dino Abaya', 'dino@example.com', 'testpassword')
      RETURNING id
    `);

    const [user1, user2, user3] = usersResult.rows;

    // Seed products
    const productsResult = await pool.query(`
      INSERT INTO products (name, price)
      VALUES
        ('Laptop', 55000.00),
        ('Wireless Mouse', 1200.00),
        ('Speaker', 5000.00),
        ('Monitor', 12000.00),
        ('Keyboard', 2000.00)
      RETURNING id
    `);

    const [product1, product2, product3, product4, product5] =
      productsResult.rows;

    // Seed sales
    await pool.query(
      `
      INSERT INTO sales (customer_id, product_id, quantity, sale_date)
      VALUES
        ($1, $2, 3, '2026-01-15'),
        ($3, $4, 2, '2026-01-20'),
        ($5, $6, 2, '2026-02-10'),
        ($3, $7, 4, '2026-02-12'),
        ($1, $8, 1, '2026-02-15')
      `,
      [
        user1.id,
        product1.id,
        user2.id,
        product2.id,
        user3.id,
        product3.id,
        product4.id,
        product5.id,
      ],
    );

    console.log("✅ Seeding completed successfully");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await pool.end();
  }
}

seed();
