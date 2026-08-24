import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://backend-tavora.fly.dev');
let socket = null;

export const acquireRealtimeSocket = () => {
  if (!socket) {
    socket = io(API_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      upgrade: true,
      reconnection: true,
      reconnectionAttempts: 4,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 8000,
    });
    socket.on('connecting', () => console.info('[socket] connecting'));
    socket.on('connect', () => console.info('[socket] connected', { transport: socket.io.engine?.transport?.name }));
    socket.on('disconnect', (reason) => console.warn('[socket] disconnected:', reason));
    socket.on('connect_error', (error) => console.warn('[socket] unavailable; HTTP data remains available:', error.message));
    socket.io.on('reconnect_attempt', (attempt) => console.info(`[socket] reconnect attempt ${attempt}/4`));
  }
  return socket;
};

export const releaseRealtimeSocket = () => {};

export const disconnectRealtimeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
