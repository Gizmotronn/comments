import { execSync } from "child_process";
import detect from 'detect-port';

export async function setupE2eTest() {
    await startSupabase();
    reseedDb();
};

async function startSupabase () {
    const port = await detect(64321);
    if (port !== 64321) {
        return;
    }
    console.warn("Supabase not detected - Starting now");
    execSync("npx supabase start");
};

function reseedDb () {
    execSync(
        'PGPASSWORD=postgres psql -U postgres -h 127.0.0.1 -p 64322 -f supabase/clear-db-data.sql',
        { stdio: 'ignore'}
    );
};