import pg from 'pg';

const client = new pg.Client({
  connectionString: "postgresql://postgres:PASSWORD_POSTGRES@8.134.153.58:5432/postgres",
  ssl: false,
});

async function checkSchema() {
  console.log("Connecting to database...");
  try {
    await client.connect();
    console.log("Connected successfully!");
    
    const tables = ['users', 'account', 'session', 'authenticator'];
    for (const table of tables) {
      console.log(`\nStructure of table: ${table}`);
      const res = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position;
      `, [table]);
      console.table(res.rows);
    }
    
    await client.end();
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

checkSchema();
