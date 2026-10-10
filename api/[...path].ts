process.env.VERCEL = '1';

const { default: app } = await import('../server.ts');

export default app;
