/**
 * Client-side WebSocket utility for real-time notifications
 * 
 * This is an example implementation that can be used in the frontend application
 * to connect to the WebSocket server and receive real-time notifications.
 */

class NotificationWebSocketClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl || 'ws://localhost:9001';
    this.socket = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 2000; // Start with 2 seconds delay
    this.handlers = {
      onNewNotification: null,
      onNotificationRead: null,
      onNotificationDeleted: null,
      onAllNotificationsDeleted: null,
      onConnectionEstablished: null,
      onConnectionClosed: null,
      onConnectionError: null
    };
    this.pingInterval = null;
  }

  /**
   * Connect to the WebSocket server
   * @param {string} userId - User ID for authentication
   * @returns {Promise} - Resolves when connection is established
   */
  connect(userId) {
    if (!userId) {
      throw new Error('User ID is required to connect to notification service');
    }

    return new Promise((resolve, reject) => {
      try {
        const url = `${this.baseUrl}/ws?userId=${userId}`;
        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
          console.log('WebSocket connection established');
          this.connected = true;
          this.reconnectAttempts = 0;
          this.startPingInterval();
          
          if (this.handlers.onConnectionEstablished) {
            this.handlers.onConnectionEstablished();
          }
          
          resolve();
        };

        this.socket.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.socket.onclose = (event) => {
          this.connected = false;
          this.stopPingInterval();
          console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
          
          if (this.handlers.onConnectionClosed) {
            this.handlers.onConnectionClosed(event);
          }
          
          this.attemptReconnect(userId);
        };

        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          
          if (this.handlers.onConnectionError) {
            this.handlers.onConnectionError(error);
          }
          
          reject(error);
        };
      } catch (error) {
        console.error('Failed to connect to WebSocket server:', error);
        reject(error);
      }
    });
  }

  /**
   * Handle incoming WebSocket messages
   * @param {string} data - Message data
   */
  handleMessage(data) {
    try {
      const message = JSON.parse(data);
      
      switch (message.type) {
        case 'connection_established':
          console.log('Connection confirmed by server:', message.message);
          break;
          
        case 'new_notification':
          if (this.handlers.onNewNotification) {
            this.handlers.onNewNotification(message.data);
          }
          break;
          
        case 'notification_read':
          if (this.handlers.onNotificationRead) {
            this.handlers.onNotificationRead(message.data);
          }
          break;
          
        case 'notification_deleted':
          if (this.handlers.onNotificationDeleted) {
            this.handlers.onNotificationDeleted(message.data);
          }
          break;
          
        case 'all_notifications_deleted':
          if (this.handlers.onAllNotificationsDeleted) {
            this.handlers.onAllNotificationsDeleted(message.data);
          }
          break;
          
        case 'pong':
          // Received response to ping
          break;
          
        default:
          console.log('Received unknown message type:', message);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  /**
   * Send a message to the WebSocket server
   * @param {Object} data - Message data
   */
  send(data) {
    if (!this.connected || !this.socket) {
      throw new Error('Not connected to WebSocket server');
    }
    
    this.socket.send(JSON.stringify(data));
  }

  /**
   * Subscribe to notification events
   */
  subscribeToNotifications() {
    this.send({ type: 'subscribe' });
  }

  /**
   * Unsubscribe from notification events
   */
  unsubscribeFromNotifications() {
    this.send({ type: 'unsubscribe' });
  }

  /**
   * Start sending periodic ping messages to keep the connection alive
   */
  startPingInterval() {
    this.pingInterval = setInterval(() => {
      if (this.connected) {
        this.send({ type: 'ping' });
      }
    }, 30000); // Send ping every 30 seconds
  }

  /**
   * Stop the ping interval
   */
  stopPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
   * Attempt to reconnect to the WebSocket server
   * @param {string} userId - User ID for authentication
   */
  attemptReconnect(userId) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Maximum reconnection attempts reached');
      return;
    }
    
    const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts);
    console.log(`Attempting to reconnect in ${delay}ms...`);
    
    setTimeout(() => {
      this.reconnectAttempts++;
      this.connect(userId).catch(() => {
        // Connection failed, next attempt will be scheduled by onclose handler
      });
    }, delay);
  }

  /**
   * Register event handlers
   * @param {Object} handlers - Event handlers
   */
  registerHandlers(handlers) {
    this.handlers = { ...this.handlers, ...handlers };
  }

  /**
   * Close the WebSocket connection
   */
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    this.connected = false;
    this.stopPingInterval();
  }
}

// Example usage:
/*
const notificationClient = new NotificationWebSocketClient();

notificationClient.registerHandlers({
  onNewNotification: (notification) => {
    console.log('New notification received:', notification);
    // Update UI with new notification
  },
  onNotificationRead: (data) => {
    console.log('Notification marked as read:', data.notificationId);
    // Update UI to reflect read status
  },
  onNotificationDeleted: (data) => {
    console.log('Notification deleted:', data.notificationId);
    // Remove notification from UI
  },
  onAllNotificationsDeleted: (data) => {
    console.log('All notifications deleted, count:', data.count);
    // Clear all notifications from UI
  },
  onConnectionEstablished: () => {
    console.log('Connected to notification service');
    // Update UI to show connected status
  },
  onConnectionClosed: () => {
    console.log('Disconnected from notification service');
    // Update UI to show disconnected status
  }
});

// Connect when user logs in
notificationClient.connect('user123')
  .then(() => {
    notificationClient.subscribeToNotifications();
  })
  .catch((error) => {
    console.error('Failed to connect to notification service:', error);
  });

// Disconnect when user logs out
function logout() {
  notificationClient.disconnect();
}
*/