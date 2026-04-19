import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/orders',
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('OrdersGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinOrder')
  handleJoinOrder(client: Socket, orderId: string) {
    client.join(`order_${orderId}`);
    this.logger.log(`Client ${client.id} joined room order_${orderId}`);
    client.emit('joinedOrder', { orderId, message: 'Tracking active' });
  }

  @SubscribeMessage('leaveOrder')
  handleLeaveOrder(client: Socket, orderId: string) {
    client.leave(`order_${orderId}`);
    this.logger.log(`Client ${client.id} left room order_${orderId}`);
  }

  // Called from OrdersService when status changes
  sendOrderUpdate(orderId: string, data: any) {
    this.server.to(`order_${orderId}`).emit('orderStatusUpdated', data);
    this.logger.log(`Order ${orderId} status update emitted: ${data.status}`);
  }

  // Called to emit rider location updates
  sendRiderLocation(orderId: string, location: { lat: number; lng: number }) {
    this.server.to(`order_${orderId}`).emit('riderLocation', location);
  }
}
