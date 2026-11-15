import { app, configureGemini } from './server';

interface WorkerEnvironment {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
  GEMINI_API_KEY?: string;
}

export default {
  async fetch(request: Request, env: WorkerEnvironment): Promise<Response> {
    if (new URL(request.url).pathname.startsWith('/api/')) {
      configureGemini(env.GEMINI_API_KEY);
      try {
        return await app.handleRequest(request);
      } catch (error) {
        console.error('API request failed:', error);
        return Response.json({ success: false, error: 'Internal server error.' }, { status: 500 });
      }
    }

    // Let Cloudflare serve the built SPA and apply its single-page-app fallback.
    return env.ASSETS.fetch(request);
  },
};
