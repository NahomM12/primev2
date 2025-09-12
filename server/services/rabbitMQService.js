/**
 * RabbitMQ Service
 * Enterprise-level implementation with connection management, error handling, and retry mechanisms
 */

const amqplib = require('amqplib');
const EventEmitter = require('events');

class RabbitMQService {
  constructor(config = {}) {
    // Configuration with defaults
    this.config = {
      protocol: config.protocol || 'amqp',
      hostname: config.hostname || process.env.RABBITMQ_HOST || 'localhost',
      port: config.port || process.env.RABBITMQ_PORT || 5672,
      username: config.username || process.env.RABBITMQ_USERNAME || 'guest',
      password: config.password || process.env.RABBITMQ_PASSWORD || 'guest',
      vhost: config.vhost || process.env.RABBITMQ_VHOST || '/',
      connectionName: config.connectionName || 'prime-app-connection',
      heartbeat: config.heartbeat || 60,
      reconnectDelay: config.reconnectDelay || 5000, // ms
      maxReconnectAttempts: config.maxReconnectAttempts || 10,
    };

    // Connection state
    this.connection = null;
    this.channel = null;
    this.reconnectAttempts = 0;
    this.isConnecting = false;
    this.shouldReconnect = true;
    
    // Event emitter for connection events
    this.events = new EventEmitter();
    
    // Channel and connection pools for scaling
    this.channelPool = [];
    this.maxChannels = config.maxChannels || 10;
    
    // Exchange and queue registry
    this.exchanges = {};
    this.queues = {};
    
    // Bind close handlers
    this._bindCloseHandlers();
  }

  /**
   * Get connection URL from config
   */
  _getConnectionUrl() {
    const { protocol, hostname, port, username, password, vhost } = this.config;
    return `${protocol}://${username}:${password}@${hostname}:${port}${vhost}`;
  }

  /**
   * Connect to RabbitMQ with retry mechanism
   */
  async connect() {
    if (this.connection) {
      return this.connection;
    }

    if (this.isConnecting) {
      return new Promise((resolve, reject) => {
        this.events.once('connected', () => resolve(this.connection));
        this.events.once('connect_failed', (err) => reject(err));
      });
    }

    this.isConnecting = true;
    
    try {
      console.log(`Connecting to RabbitMQ at ${this.config.hostname}:${this.config.port}...`);
      
      const connectionOptions = {
        clientProperties: {
          connection_name: this.config.connectionName,
          application: 'prime-app',
        },
        heartbeat: this.config.heartbeat
      };
      
      this.connection = await amqplib.connect(
        this._getConnectionUrl(),
        connectionOptions
      );
      
      console.log('Successfully connected to RabbitMQ');
      this.reconnectAttempts = 0;
      this.isConnecting = false;
      
      // Setup connection event handlers
      this.connection.on('error', this._onConnectionError.bind(this));
      this.connection.on('close', this._onConnectionClose.bind(this));
      
      // Create default channel
      await this._createChannel();
      
      this.events.emit('connected', this.connection);
      return this.connection;
    } catch (error) {
      this.isConnecting = false;
      console.error('Failed to connect to RabbitMQ:', error.message);
      this.events.emit('connect_failed', error);
      
      // Implement reconnection strategy
      if (this.shouldReconnect && this.reconnectAttempts < this.config.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`Reconnecting to RabbitMQ in ${this.config.reconnectDelay}ms (attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`);
        
        setTimeout(() => {
          this.connect().catch(err => {
            console.error('Reconnection attempt failed:', err.message);
          });
        }, this.config.reconnectDelay);
      } else if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached. Giving up.');
      }
      
      throw error;
    }
  }

  /**
   * Create a channel with prefetch count
   */
  async _createChannel(prefetch = 10) {
    if (!this.connection) {
      await this.connect();
    }
    
    try {
      const channel = await this.connection.createChannel();
      await channel.prefetch(prefetch);
      
      // Setup channel event handlers
      channel.on('error', (err) => {
        console.error('Channel error:', err.message);
        this.events.emit('channel_error', err);
      });
      
      channel.on('close', () => {
        console.log('Channel closed');
        this.events.emit('channel_closed');
        
        // Remove from pool if in pool
        const index = this.channelPool.indexOf(channel);
        if (index !== -1) {
          this.channelPool.splice(index, 1);
        }
      });
      
      // Set default channel if not set
      if (!this.channel) {
        this.channel = channel;
      }
      
      // Add to channel pool if not full
      if (this.channelPool.length < this.maxChannels) {
        this.channelPool.push(channel);
      }
      
      return channel;
    } catch (error) {
      console.error('Failed to create channel:', error.message);
      throw error;
    }
  }

  /**
   * Get a channel from the pool or create a new one
   */
  async getChannel() {
    if (this.channelPool.length > 0) {
      return this.channelPool[0]; // Simple round-robin could be implemented
    }
    
    return this._createChannel();
  }

  /**
   * Handle connection errors
   */
  _onConnectionError(err) {
    console.error('RabbitMQ connection error:', err.message);
    this.events.emit('connection_error', err);
  }

  /**
   * Handle connection close
   */
  _onConnectionClose() {
    console.log('RabbitMQ connection closed');
    this.channel = null;
    this.channelPool = [];
    this.connection = null;
    
    this.events.emit('disconnected');
    
    // Attempt to reconnect if not shutting down
    if (this.shouldReconnect) {
      setTimeout(() => {
        console.log('Attempting to reconnect to RabbitMQ...');
        this.connect().catch(err => {
          console.error('Failed to reconnect:', err.message);
        });
      }, this.config.reconnectDelay);
    }
  }

  /**
   * Bind close handlers for graceful shutdown
   */
  _bindCloseHandlers() {
    // Handle process termination signals
    ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => {
      process.once(signal, () => {
        this.shouldReconnect = false;
        this.close().catch(err => {
          console.error(`Error during graceful shutdown (${signal}):`, err.message);
          process.exit(1);
        });
      });
    });
  }

  /**
   * Assert an exchange with options
   */
  async assertExchange(name, type = 'direct', options = {}) {
    const channel = await this.getChannel();
    
    const defaultOptions = {
      durable: true,
      autoDelete: false,
      internal: false,
      arguments: null
    };
    
    const exchangeOptions = { ...defaultOptions, ...options };
    
    try {
      await channel.assertExchange(name, type, exchangeOptions);
      this.exchanges[name] = { type, options: exchangeOptions };
      return name;
    } catch (error) {
      console.error(`Failed to assert exchange ${name}:`, error.message);
      throw error;
    }
  }

  /**
   * Assert a queue with options
   */
  async assertQueue(name, options = {}) {
    const channel = await this.getChannel();
    
    const defaultOptions = {
      durable: true,
      exclusive: false,
      autoDelete: false,
      arguments: null
    };
    
    const queueOptions = { ...defaultOptions, ...options };
    
    try {
      const queue = await channel.assertQueue(name, queueOptions);
      this.queues[name] = { options: queueOptions };
      return queue;
    } catch (error) {
      console.error(`Failed to assert queue ${name}:`, error.message);
      throw error;
    }
  }

  /**
   * Bind a queue to an exchange
   */
  async bindQueue(queue, exchange, routingKey = '') {
    const channel = await this.getChannel();
    
    try {
      await channel.bindQueue(queue, exchange, routingKey);
      return true;
    } catch (error) {
      console.error(`Failed to bind queue ${queue} to exchange ${exchange}:`, error.message);
      throw error;
    }
  }

  /**
   * Publish a message to an exchange
   */
  async publish(exchange, routingKey, content, options = {}) {
    const channel = await this.getChannel();
    
    const defaultOptions = {
      persistent: true,
      contentType: 'application/json',
      contentEncoding: 'utf-8',
      timestamp: Math.floor(Date.now() / 1000)
    };
    
    const publishOptions = { ...defaultOptions, ...options };
    
    // Ensure exchange exists
    if (!this.exchanges[exchange]) {
      await this.assertExchange(exchange);
    }
    
    try {
      // Convert content to Buffer if it's an object
      const buffer = Buffer.isBuffer(content) 
        ? content 
        : Buffer.from(typeof content === 'object' ? JSON.stringify(content) : String(content));
      
      const result = channel.publish(exchange, routingKey, buffer, publishOptions);
      
      if (!result) {
        // Channel write buffer is full, wait for drain event
        await new Promise((resolve) => channel.once('drain', resolve));
      }
      
      return true;
    } catch (error) {
      console.error(`Failed to publish message to ${exchange}:`, error.message);
      throw error;
    }
  }

  /**
   * Consume messages from a queue
   */
  async consume(queue, callback, options = {}) {
    const channel = await this.getChannel();
    
    // Ensure queue exists
    if (!this.queues[queue]) {
      await this.assertQueue(queue);
    }
    
    const defaultOptions = {
      noAck: false,
      exclusive: false,
    };
    
    const consumeOptions = { ...defaultOptions, ...options };
    
    try {
      // Wrap callback to handle errors and parsing
      const wrappedCallback = async (msg) => {
        if (!msg) return;
        
        try {
          // Parse message content if it's JSON
          let content;
          if (msg.properties.contentType === 'application/json') {
            content = JSON.parse(msg.content.toString());
          } else {
            content = msg.content.toString();
          }
          
          // Call the original callback
          await callback(content, msg);
          
          // Acknowledge message if noAck is false
          if (!consumeOptions.noAck) {
            channel.ack(msg);
          }
        } catch (error) {
          console.error('Error processing message:', error.message);
          
          // Reject the message and requeue if it's a temporary error
          if (!consumeOptions.noAck) {
            const requeue = error.isTemporary === true;
            channel.reject(msg, requeue);
          }
          
          // Emit error event
          this.events.emit('consume_error', error, msg);
        }
      };
      
      const { consumerTag } = await channel.consume(queue, wrappedCallback, consumeOptions);
      return consumerTag;
    } catch (error) {
      console.error(`Failed to consume from queue ${queue}:`, error.message);
      throw error;
    }
  }

  /**
   * Cancel a consumer
   */
  async cancelConsumer(consumerTag) {
    const channel = await this.getChannel();
    
    try {
      await channel.cancel(consumerTag);
      return true;
    } catch (error) {
      console.error(`Failed to cancel consumer ${consumerTag}:`, error.message);
      throw error;
    }
  }

  /**
   * Initialize the RabbitMQ service
   * This is the main entry point for setting up the service
   */
  async initialize() {
    try {
      // Connect to RabbitMQ server
      await this.connect();
      console.log('RabbitMQ service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize RabbitMQ service:', error.message);
      throw error;
    }
  }

  /**
   * Close connection and channels
   */
  async close() {
    console.log('Closing RabbitMQ connection...');
    
    try {
      // Close all channels in the pool
      for (const channel of this.channelPool) {
        if (channel && channel.close) {
          await channel.close();
        }
      }
      
      // Close main channel if not in pool
      if (this.channel && !this.channelPool.includes(this.channel) && this.channel.close) {
        await this.channel.close();
      }
      
      // Close connection
      if (this.connection && this.connection.close) {
        await this.connection.close();
      }
      
      this.channel = null;
      this.channelPool = [];
      this.connection = null;
      
      console.log('RabbitMQ connection closed successfully');
      return true;
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error.message);
      throw error;
    }
  }
}

// Create singleton instance
const rabbitMQService = new RabbitMQService();

module.exports = rabbitMQService;