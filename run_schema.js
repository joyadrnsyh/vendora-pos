// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Client } = require('pg');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');

const run = async () => {
    const client = new Client({
        connectionString: "postgres://postgres.vmassjkuasoaimgohsoh:AQTN3xdhCKfMDGJa@aws-1-us-east-1.pooler.supabase.com:5432/postgres",
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        const schema = fs.readFileSync('C:\\Users\\joyad\\.gemini\\antigravity-ide\\brain\\befd4d09-b9c7-4183-a44b-b837e0a77cc3\\supabase_schema.sql', 'utf8');
        await client.query(schema);
        console.log("Schema applied successfully.");
    } catch (e) {
        console.error("Error applying schema: ", e);
    } finally {
        await client.end();
    }
};

run();
