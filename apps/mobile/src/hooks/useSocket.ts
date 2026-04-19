import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../constants/api';
import { useAuthStore } from '../store/authStore';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!token) return;

    socketRef.current = io(`${SOCKET_URL}/orders`, {
      transports: ['websocket'],
      auth: { token },
    });

    socketRef.current.on('connect', () => {
      console.log('🔌 Socket connected');
    });

    socketRef.current.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [token]);

  const joinOrder = useCallback((orderId: string) => {
    socketRef.current?.emit('joinOrder', orderId);
  }, []);

  const leaveOrder = useCallback((orderId: string) => {
    socketRef.current?.emit('leaveOrder', orderId);
  }, []);

  const onOrderUpdate = useCallback(
    (callback: (data: any) => void) => {
      socketRef.current?.on('orderStatusUpdated', callback);
      return () => {
        socketRef.current?.off('orderStatusUpdated', callback);
      };
    },
    [],
  );

  const onRiderLocation = useCallback(
    (callback: (data: { lat: number; lng: number }) => void) => {
      socketRef.current?.on('riderLocation', callback);
      return () => {
        socketRef.current?.off('riderLocation', callback);
      };
    },
    [],
  );

  return { joinOrder, leaveOrder, onOrderUpdate, onRiderLocation };
}
