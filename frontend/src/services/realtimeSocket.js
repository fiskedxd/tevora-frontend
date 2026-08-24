import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://backend-tavora.fly.dev');
let socket = null;
let consumers = 0;

export const acquireRealtimeSocket = () => {
  if (!socket) {
    socket = io(API_URL, {
      path: '/socket.io',
      transports: ['polling'],
      upgrade: false,
      reconnection: true,
      reconnectionAttempts: 4,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 8000,
    });
    socket.on('connect_error', (error) => console.warn('[socket] unavailable; HTTP data remains available:', error.message));
  }
  consumers += 1;
  return socket;
};

export const releaseRealtimeSocket = () => {
  consumers = Math.max(0, consumers - 1);
  if (consumers === 0 && socket) {
    socket.disconnect();
    socket = null;
  }
};
