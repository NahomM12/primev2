/**
 * Notification Message Broker Service
 * Enterprise-level implementation for handling notification messages via RabbitMQ
 */

const rabbitMQService = require('./rabbitMQService');

// Constants for exchanges, queues, and routing keys
const EXCHANGES = {
  NOTIFICATIONS: 'notifications.exchange',
  EVENTS: 'events.exchange'
};

const QUEUES = {
  NOTIFICATIONS: 'notifications.queue',
  UNREAD_COUNTS: 'unread_counts.queue',
  PUSH_NOTIFICATIONS: 'push_notifications.queue'
};

const ROUTING_KEYS = {
  NEW_NOTIFICATION: 'notification.new',
  READ_NOTIFICATION: 'notification.read',
  DELETE_NOTIFICATION: 'notification.delete',
  DELETE_ALL_NOTIFICATIONS: 'notification.delete.all',
  USER_SPECIFIC: (userId) => `user.${userId}`
};

class NotificationMessageBroker {
  constructor() {
    this.initialized = false;
    this.consumers = new Map();
  }

  /**
   * Initialize the message broker
   * Sets up exchanges, queues, and bindings
   */
  async initialize() {
    if (this.initialized) return;

    try {
      // Connect to RabbitMQ
      await rabbitMQService.connect();

      // Setup exchanges
      await rabbitMQService.assertExchange(EXCHANGES.NOTIFICATIONS, 'topic', { durable: true });
      await rabbitMQService.assertExchange(EXCHANGES.EVENTS, 'fanout', { durable: true });

      // Setup queues
      await rabbitMQService.assertQueue(QUEUES.NOTIFICATIONS, { durable: true });
      await rabbitMQService.assertQueue(QUEUES.UNREAD_COUNTS, { durable: true });
      await rabbitMQService.assertQueue(QUEUES.PUSH_NOTIFICATIONS, { durable: true });

      // Bind queues to exchanges
      await rabbitMQService.bindQueue(
        QUEUES.NOTIFICATIONS, 
        EXCHANGES.NOTIFICATIONS, 
        '#'
      );
      
      await rabbitMQService.bindQueue(
        QUEUES.UNREAD_COUNTS, 
        EXCHANGES.NOTIFICATIONS, 
        '#'
      );
      
      await rabbitMQService.bindQueue(
        QUEUES.PUSH_NOTIFICATIONS, 
        EXCHANGES.NOTIFICATIONS, 
        ROUTING_KEYS.NEW_NOTIFICATION
      );

      this.initialized = true;
      console.log('Notification Message Broker initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Notification Message Broker:', error.message);
      throw error;
    }
  }

  /**
   * Publish a new notification message
   * @param {Object} notification - The notification object
   * @param {String} userId - The recipient user ID
   */
  async publishNewNotification(notification, userId) {
    await this._ensureInitialized();

    try {
      const message = {
        type: 'new_notification',
        notification,
        userId,
        timestamp: new Date().toISOString()
      };

      // Publish to general notification routing key
      await rabbitMQService.publish(
        EXCHANGES.NOTIFICATIONS,
        ROUTING_KEYS.NEW_NOTIFICATION,
        message
      );

      // Publish to user-specific routing key
      await rabbitMQService.publish(
        EXCHANGES.NOTIFICATIONS,
        ROUTING_KEYS.USER_SPECIFIC(userId),
        message
      );

      console.log(`Published new notification for user ${userId}`);
      return true;
    } catch (error) {
      console.error('Failed to publish new notification:', error.message);
      throw error;
    }
  }

  /**
   * Publish notification read event
   * @param {String} notificationId - The notification ID
   * @param {String} userId - The user ID
   */
  async publishNotificationRead(notificationId, userId) {
    await this._ensureInitialized();

    try {
      const message = {
        type: 'notification_read',
        notificationId,
        userId,
        timestamp: new Date().toISOString()
      };

      // Publish to read notification routing key
      await rabbitMQService.publish(
        EXCHANGES.NOTIFICATIONS,
        ROUTING_KEYS.READ_NOTIFICATION,
        message
      );

      // Publish to user-specific routing key
      await rabbitMQService.publish(
        EXCHANGES.NOTIFICATIONS,
        ROUTING_KEYS.USER_SPECIFIC(userId),
        message
      );

      console.log(`Published notification read event for notification ${notificationId}`);
      return true;
    } catch (error) {
      console.error('Failed to publish notification read event:', error.message);
      throw error;
    }
  }

  /**
   * Publish notification delete event
   * @param {String} notificationId - The notification ID
   * @param {String} userId - The user ID
   */
  async publishNotificationDelete(notificationId, userId) {
    await this._ensureInitialized();

    try {
      const message = {
        type: 'notification_delete',
        notificationId,
        userId,
        timestamp: new Date().toISOString()
      };

      // Publish to delete notification routing key
      await rabbitMQService.publish(
        EXCHANGES.NOTIFICATIONS,
        ROUTING_KEYS.DELETE_NOTIFICATION,
        message
      );

      // Publish to user-specific routing key
      await rabbitMQService.publish(
        EXCHANGES.NOTIFICATIONS,
        ROUTING_KEYS.USER_SPECIFIC(userId),
        message
      );

      console.log(`Published notification delete event for notification ${notificationId}`);
      return true;
    } catch (error) {
      console.error('Failed to publish notification delete event:', error.message);
      throw error;
    }
  }

  /**
   * Publish delete all notifications event
   * @param {String} userId - The user ID
   * @param {Number} count - The number of deleted notifications
   */
  async publishDeleteAllNotifications(userId, count) {
    await this._ensureInitialized();

    try {
      const message = {
        type: 'delete_all_notifications',
        userId,
        count,
        timestamp: new Date().toISOString()
      };

      // Publish to delete all notifications routing key
      await rabbitMQService.publish(
        EXCHANGES.NOTIFICATIONS,
        ROUTING_KEYS.DELETE_ALL_NOTIFICATIONS,
        message
      );

      // Publish to user-specific routing key
      await rabbitMQService.publish(
        EXCHANGES.NOTIFICATIONS,
        ROUTING_KEYS.USER_SPECIFIC(userId),
        message
      );

      console.log(`Published delete all notifications event for user ${userId}`);
      return true;
    } catch (error) {
      console.error('Failed to publish delete all notifications event:', error.message);
      throw error;
    }
  }

  /**
   * Subscribe to user-specific notifications
   * @param {String} userId - The user ID
   * @param {Function} callback - The callback function
   */
  async subscribeToUserNotifications(userId, callback) {
    await this._ensureInitialized();

    try {
      // Create a user-specific queue
      const queueName = `user.${userId}.notifications`;
      await rabbitMQService.assertQueue(queueName, { 
        durable: false,
        autoDelete: true,
        arguments: {
          'x-expires': 3600000 // Auto-delete after 1 hour of inactivity
        }
      });

      // Bind to user-specific routing key
      await rabbitMQService.bindQueue(
        queueName,
        EXCHANGES.NOTIFICATIONS,
        ROUTING_KEYS.USER_SPECIFIC(userId)
      );

      // Start consuming
      const consumerTag = await rabbitMQService.consume(queueName, callback, { noAck: true });
      
      // Store consumer tag for later cancellation
      this.consumers.set(userId, { queueName, consumerTag });

      console.log(`Subscribed to notifications for user ${userId}`);
      return consumerTag;
    } catch (error) {
      console.error(`Failed to subscribe to notifications for user ${userId}:`, error.message);
      throw error;
    }
  }

  /**
   * Unsubscribe from user-specific notifications
   * @param {String} userId - The user ID
   */
  async unsubscribeFromUserNotifications(userId) {
    if (!this.consumers.has(userId)) {
      return false;
    }

    try {
      const { consumerTag } = this.consumers.get(userId);
      await rabbitMQService.cancelConsumer(consumerTag);
      this.consumers.delete(userId);

      console.log(`Unsubscribed from notifications for user ${userId}`);
      return true;
    } catch (error) {
      console.error(`Failed to unsubscribe from notifications for user ${userId}:`, error.message);
      throw error;
    }
  }

  /**
   * Subscribe to unread count updates
   * @param {Function} callback - The callback function
   */
  async subscribeToUnreadCountUpdates(callback) {
    await this._ensureInitialized();

    try {
      // Start consuming from unread counts queue
      const consumerTag = await rabbitMQService.consume(QUEUES.UNREAD_COUNTS, callback);
      console.log('Subscribed to unread count updates');
      return consumerTag;
    } catch (error) {
      console.error('Failed to subscribe to unread count updates:', error.message);
      throw error;
    }
  }

  /**
   * Subscribe to push notifications
   * @param {Function} callback - The callback function
   */
  async subscribeToPushNotifications(callback) {
    await this._ensureInitialized();

    try {
      // Start consuming from push notifications queue
      const consumerTag = await rabbitMQService.consume(QUEUES.PUSH_NOTIFICATIONS, callback);
      console.log('Subscribed to push notifications');
      return consumerTag;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error.message);
      throw error;
    }
  }

  /**
   * Ensure the broker is initialized
   * @private
   */
  async _ensureInitialized() {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  /**
   * Consume new notification events
   * @param {Function} callback - The callback function
   */
  async consumeNewNotifications(callback) {
    await this._ensureInitialized();

    try {
      // Create a dedicated queue for new notifications
      const queueName = 'new_notifications.queue';
      await rabbitMQService.assertQueue(queueName, { durable: true });
      
      // Bind to new notification routing key
      await rabbitMQService.bindQueue(
        queueName,
        EXCHANGES.NOTIFICATIONS,
        ROUTING_KEYS.NEW_NOTIFICATION
      );

      // Start consuming
      const consumerTag = await rabbitMQService.consume(queueName, callback, { noAck: true });
      console.log('Subscribed to new notification events');
      return consumerTag;
    } catch (error) {
      console.error('Failed to consume new notifications:', error.message);
      throw error;
    }
  }

  /**
   * Consume notification read events
   * @param {Function} callback - The callback function
   */
  async consumeNotificationReadEvents(callback) {
    await this._ensureInitialized();

    try {
      // Create a dedicated queue for read notifications
      const queueName = 'read_notifications.queue';
      await rabbitMQService.assertQueue(queueName, { durable: true });
      
      // Bind to read notification routing key
      await rabbitMQService.bindQueue(
        queueName,
        EXCHANGES.NOTIFICATIONS,
        ROUTING_KEYS.READ_NOTIFICATION
      );

      // Start consuming
      const consumerTag = await rabbitMQService.consume(queueName, callback, { noAck: true });
      console.log('Subscribed to notification read events');
      return consumerTag;
    } catch (error) {
      console.error('Failed to consume notification read events:', error.message);
      throw error;
    }
  }

  /**
   * Consume notification delete events
   * @param {Function} callback - The callback function
   */
  async consumeNotificationDeleteEvents(callback) {
    await this._ensureInitialized();

    try {
      // Create a dedicated queue for delete notifications
      const queueName = 'delete_notifications.queue';
      await rabbitMQService.assertQueue(queueName, { durable: true });
      
      // Bind to delete notification routing key
      await rabbitMQService.bindQueue(
        queueName,
        EXCHANGES.NOTIFICATIONS,
        ROUTING_KEYS.DELETE_NOTIFICATION
      );

      // Start consuming
      const consumerTag = await rabbitMQService.consume(queueName, callback, { noAck: true });
      console.log('Subscribed to notification delete events');
      return consumerTag;
    } catch (error) {
      console.error('Failed to consume notification delete events:', error.message);
      throw error;
    }
  }

  /**
   * Consume delete all notifications events
   * @param {Function} callback - The callback function
   */
  async consumeDeleteAllNotificationsEvents(callback) {
    await this._ensureInitialized();

    try {
      // Create a dedicated queue for delete all notifications
      const queueName = 'delete_all_notifications.queue';
      await rabbitMQService.assertQueue(queueName, { durable: true });
      
      // Bind to delete all notifications routing key
      await rabbitMQService.bindQueue(
        queueName,
        EXCHANGES.NOTIFICATIONS,
        ROUTING_KEYS.DELETE_ALL_NOTIFICATIONS
      );

      // Start consuming
      const consumerTag = await rabbitMQService.consume(queueName, callback, { noAck: true });
      console.log('Subscribed to delete all notifications events');
      return consumerTag;
    } catch (error) {
      console.error('Failed to consume delete all notifications events:', error.message);
      throw error;
    }
  }

  /**
   * Close the message broker
   */
  async close() {
    try {
      // Cancel all consumers
      for (const [userId, { consumerTag }] of this.consumers.entries()) {
        await rabbitMQService.cancelConsumer(consumerTag);
      }

      this.consumers.clear();
      this.initialized = false;

      console.log('Notification Message Broker closed successfully');
      return true;
    } catch (error) {
      console.error('Error closing Notification Message Broker:', error.message);
      throw error;
    }
  }
}

// Create singleton instance
const notificationMessageBroker = new NotificationMessageBroker();

module.exports = notificationMessageBroker;