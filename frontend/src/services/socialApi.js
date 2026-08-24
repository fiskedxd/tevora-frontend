const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://backend-tavora.fly.dev');
const pendingSocialRequests = new Map();

export const fetchSocial = (userId, getAuthHeaders) => {
  const key = String(userId || '');
  if (!key) return Promise.reject(new Error('Utilisateur absent.'));
  const pending = pendingSocialRequests.get(key);
  if (pending) {
    console.info('[social] reusing in-flight /api/social/me request');
    return pending;
  }
  const startedAt = performance.now();
  console.info('[social] /api/social/me fetch start');
  const request = fetch(`${API_URL}/api/social/me`, { headers: getAuthHeaders() })
    .then(async (response) => {
      console.info('[social] /api/social/me HTTP response received', { status: response.status, durationMs: Math.round(performance.now() - startedAt) });
      const text = await response.text();
      let data = {};
      try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }
      console.info('[social] /api/social/me JSON parse done', { durationMs: Math.round(performance.now() - startedAt) });
      if (!response.ok) throw new Error(data.message || 'Impossible de charger la vue sociale.');
      console.info('[social] /api/social/me completed', { durationMs: Math.round(performance.now() - startedAt) });
      return data;
    })
    .catch((error) => {
      console.error('[social] /api/social/me failed', { durationMs: Math.round(performance.now() - startedAt), error });
      throw error;
    })
    .finally(() => {
      if (pendingSocialRequests.get(key) === request) pendingSocialRequests.delete(key);
    });
  pendingSocialRequests.set(key, request);
  return request;
};
