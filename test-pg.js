import { Pool } from 'pg';

const pool = new Pool({
  connectionString: "postgres://postgres.gpewaqtvokixthembell:mkZMSrKMw3qR7U7h@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=no-verify&pgbouncer=true",
  ssl: { rejectUnauthorized: false }
});

async function main() {
  const client = await pool.connect();
  console.log('Connected!');
  client.release();
}

main().catch(console.error);
