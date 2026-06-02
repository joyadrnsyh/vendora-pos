const { Client } = require('pg');

const run = async () => {
    const client = new Client({
        connectionString: "postgres://postgres.vmassjkuasoaimgohsoh:AQTN3xdhCKfMDGJa@aws-1-us-east-1.pooler.supabase.com:5432/postgres",
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        await client.query(`
            begin;
            drop publication if exists supabase_realtime;
            create publication supabase_realtime;
            commit;
            alter publication supabase_realtime add table stores;
            alter publication supabase_realtime add table products;
            alter publication supabase_realtime add table users;
            alter publication supabase_realtime add table transactions;
        `);
        console.log("Realtime enabled successfully.");
    } catch (e) {
        console.error("Error enabling realtime: ", e);
    } finally {
        await client.end();
    }
};

run();
