import { withReplayGuard } from "../packages/guard-sdk/src/index.ts";

const config = {
  apiKey: 'sk_test_12345',
  monitorId: 'cmp18ddab0002z822eiwjkuqp',
  baseUrl: 'http://localhost:4040'
};

async function runTest() {
  const externalId = `test-job-${Date.now()}`;
  
  console.log('\n🚀 --- Attempt 1: Running job that fails mid-way ---');
  try {
    await withReplayGuard(config, async (guard) => {
      console.log('Step 1: Guarding Database Write');
      await guard.wrap('DB', 'users', { action: 'create', email: 'test@example.com' }, async () => {
        console.log('✅ [EXECUTED] DB Write performed');
      });

      console.log('Step 2: Simulating failure before Payment...');
      throw new Error('Database connection lost (Simulated)');
    }, externalId);
  } catch (e: any) {
    console.log('❌ Attempt 1 failed:', e.message);
  }

  console.log('\n🔄 --- Attempt 2: Replaying the same job ---');
  try {
    await withReplayGuard(config, async (guard) => {
      console.log('Step 1: Guarding Database Write');
      await guard.wrap('DB', 'users', { action: 'create', email: 'test@example.com' }, async () => {
        console.log('❌ [ERROR] This should NOT run again!');
        throw new Error('Double side effect detected!');
      });
      console.log('✅ [SKIPPED] ReplayGuard prevented duplicate DB write');

      console.log('Step 2: Guarding Payment API');
      await guard.wrap('HTTP', 'https://api.stripe.com/v1/charges', { amount: 1000 }, async () => {
        console.log('✅ [EXECUTED] Payment processed safely');
      });
      
      console.log('🏁 Job finished successfully!');
    }, externalId);
  } catch (e: any) {
    console.error('❌ Replay failed unexpectedly:', e);
  }
}

runTest().catch(console.error);
