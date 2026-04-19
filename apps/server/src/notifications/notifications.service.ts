import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService implements OnModuleInit {
  private logger = new Logger('NotificationsService');
  private firebaseApp: any;
  private isInitialized = false;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
      const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY');
      const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');

      if (!projectId || !privateKey || !clientEmail) {
        this.logger.warn(
          'Firebase credentials not configured — push notifications disabled',
        );
        return;
      }

      const admin = require('firebase-admin');

      if (!admin.apps.length) {
        this.firebaseApp = admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            privateKey: privateKey.replace(/\\n/g, '\n'),
            clientEmail,
          }),
        });
        this.isInitialized = true;
        this.logger.log('Firebase Admin initialized successfully');
      }
    } catch (error) {
      this.logger.error('Firebase initialization failed:', error.message);
    }
  }

  async sendToDevice(fcmToken: string, title: string, body: string, data?: Record<string, string>) {
    if (!this.isInitialized) {
      this.logger.warn('Firebase not initialized — skipping notification');
      return;
    }

    try {
      const admin = require('firebase-admin');
      const message = {
        token: fcmToken,
        notification: { title, body },
        data: data || {},
        android: {
          notification: {
            channelId: 'ummaheats-orders',
            priority: 'high' as const,
          },
        },
      };

      const response = await admin.messaging().send(message);
      this.logger.log(`Notification sent: ${response}`);
      return response;
    } catch (error) {
      this.logger.error(`Failed to send notification: ${error.message}`);
    }
  }

  async sendOrderUpdate(fcmToken: string, orderId: string, status: string) {
    const statusMessages: Record<string, string> = {
      ACCEPTED: 'Your order has been accepted! 🎉',
      PREPARING: 'Your food is being prepared 👨‍🍳',
      READY: 'Your order is ready for pickup! 📦',
      PICKED_UP: 'Your order is on the way! 🛵',
      DELIVERED: 'Order delivered! Enjoy your meal! 🍽️',
      CANCELLED: 'Your order has been cancelled ❌',
    };

    await this.sendToDevice(
      fcmToken,
      'UmmahEats - Order Update',
      statusMessages[status] || `Order status: ${status}`,
      { orderId, status },
    );
  }
}
