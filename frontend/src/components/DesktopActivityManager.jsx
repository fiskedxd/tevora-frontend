import { useEffect, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://backend-tavora.fly.dev');
const HEARTBEAT_MS = 30000;

export default function DesktopActivityManager({ user, getAuthHeaders }) {
  const lastApplicationRef = useRef(null);

  useEffect(() => {
    if (!user || !window.tevoraDesktop?.isDesktop || !getAuthHeaders) return undefined;
    let cancelled = false;
    const publish = async () => {
      const detected = await window.tevoraDesktop.detectApplications();
      if (cancelled) return;
      const application = detected[0];
      if (!application) {
        if (lastApplicationRef.current) {
          await fetch(`${API_URL}/api/social/activity`, { method: 'DELETE', headers: getAuthHeaders() }).catch(() => {});
          lastApplicationRef.current = null;
        }
        return;
      }
      const payload = {
        applicationId: application.id,
        applicationName: application.name,
        applicationType: application.type,
      };
      if (lastApplicationRef.current !== application.id) lastApplicationRef.current = application.id;
      const response = await fetch(`${API_URL}/api/social/activity`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      }).catch(() => null);
      if (response?.ok) await response.json();
    };
    publish();
    const intervalId = window.setInterval(publish, HEARTBEAT_MS);
    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      if (lastApplicationRef.current) fetch(`${API_URL}/api/social/activity`, { method: 'DELETE', headers: getAuthHeaders() }).catch(() => {});
    };
  }, [getAuthHeaders, user?.id, user?._id, user?.privacy?.activity]);

  return null;
}
