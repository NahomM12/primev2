/**
 * WebSocket Service for handling real-time client connections
 * This service integrates with RabbitMQ to deliver notifications to connected clients
 */

const WebSocket = require('ws');
const notificationMessageBroker = require('./notificationMessageBroker');

class WebSocketService {
  constructor() {
    this.wss = null;
    this.clients = new Map(); // Maps userId to WebSocket connection
    this.initialized = false;
  }

  /**
   * Initialize the WebSocket server
   * @param {Object} server - HTTP server instance
   */
  initialize(server) {
    if (this.initialized) {
      console.log('WebSocket service already initialized');
      return;
    }

    try {
      this.wss = new WebSocket.Server({ server });
      
      this.wss.on('connection', (ws, req) => {
        this.handleConnection(ws, req);
      });

      // Subscribe to notification events from RabbitMQ
      this.subscribeToNotificationEvents();
      
      this.initialized = true;
      console.log('WebSocket service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize WebSocket service:', error);
      throw error;
    }
  }

  /**
   * Handle new WebSocket connections
   * @param {WebSocket} ws - WebSocket connection
   * @param {Object} req - HTTP request
   */
  handleConnection(ws, req) {
    // Extract user ID from query parameters or authentication token
    const url = new URL(req.url, 'http://localhost');
    const userId = url.searchParams.get('userId');

    if (!userId) {
      console.error('Connection rejected: No user ID provided');
      ws.close(1008, 'User ID required');
      return;
    }

    console.log(`New WebSocket connection established for user: ${userId}`);
    
    // Store the connection with the user ID
    this.clients.set(userId, ws);

    // Handle client messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        this.handleClientMessage(userId, data, ws);
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });

    // Handle client disconnection
    ws.on('close', () => {
      console.log(`WebSocket connection closed for user: ${userId}`);
      this.clients.delete(userId);
    });

    // Send initial connection confirmation
    ws.send(JSON.stringify({
      type: 'connection_established',
      message: 'Connected to notification service'
    }));
  }

  /**
   * Handle messages received from clients
   * @param {string} userId - User ID
   * @param {Object} data - Message data
   * @param {WebSocket} ws - WebSocket connection
   */
  handleClientMessage(userId, data, ws) {
    switch (data.type) {
      case 'subscribe':
        // Handle subscription requests
        console.log(`User ${userId} subscribed to notifications`);
        notificationMessageBroker.subscribeUserToNotifications(userId);
        break;
      
      case 'unsubscribe':
        // Handle unsubscription requests
        console.log(`User ${userId} unsubscribed from notifications`);
        break;
      
      case 'ping':
        // Handle ping messages to keep connection alive
        ws.send(JSON.stringify({ type: 'pong' }));
        break;
      
      default:
        console.log(`Received unknown message type from user ${userId}:`, data);
    }
  }

  /**
   * Subscribe to notification events from RabbitMQ
   */
  subscribeToNotificationEvents() {
    // Subscribe to new notification events
    notificationMessageBroker.consumeNewNotifications((notification) => {
      this.sendNotificationToUser(notification.recipient, {
        type: 'new_notification',
        data: notification
      });
    });

    // Subscribe to notification read events
    notificationMessageBroker.consumeNotificationReadEvents((data) => {
      this.sendNotificationToUser(data.userId, {
        type: 'notification_read',
        data: { notificationId: data.notificationId }
      });
    });

    // Subscribe to notification delete events
    notificationMessageBroker.consumeNotificationDeleteEvents((data) => {
      this.sendNotificationToUser(data.userId, {
        type: 'notification_deleted',
        data: { notificationId: data.notificationId }
      });
    });

    // Subscribe to delete all notifications events
    notificationMessageBroker.consumeDeleteAllNotificationsEvents((data) => {
      this.sendNotificationToUser(data.userId, {
        type: 'all_notifications_deleted',
        data: { count: data.count }
      });
    });
  }

  /**
   * Send a notification to a specific user
   * @param {string} userId - User ID
   * @param {Object} data - Notification data
   */
  sendNotificationToUser(userId, data) {
    const client = this.clients.get(userId);
    
    if (client && client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify(data));
      } catch (error) {
        console.error(`Error sending notification to user ${userId}:`, error);
      }
    } else {
      console.log(`User ${userId} is not connected. Notification will be delivered when they reconnect.`);
    }
  }

  /**
   * Broadcast a message to all connected clients
   * @param {Object} data - Message data
   */
  broadcast(data) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  /**
   * Close all connections and shutdown the WebSocket server
   */
  shutdown() {
    if (this.wss) {
      this.wss.close(() => {
        console.log('WebSocket server closed');
      });
    }
    
    this.clients.clear();
    this.initialized = false;
  }
}

// Export as singleton
module.exports = new WebSocketService();