import 'dotenv/config';
import { createPool, Pool } from 'mysql2/promise';
const db: Pool = createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
} as any);

// const db: Pool = createPool({
//   host: 'localhost',
//   port: 3306,
//   database: 'tiendau_ecommerce',
//   user: 'tiendau_ecommerce',
//   password: 'tiendau_ecommerce41.',
// } as any);

export default db;
