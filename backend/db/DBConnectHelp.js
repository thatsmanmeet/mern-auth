import mongoose from 'mongoose';
import colors from 'colors';

const MAX_RETRIES = 3;
const RETRY_INTERVAL = 3000;

class DBConnection {
  constructor() {
    this.isConnected = false;
    this.retryCount = 0;

    mongoose.set('strictQuery', true);

    mongoose.connection.on('connected', () => {
      console.log(
        `✅ MONGODB CONNECTION SUCCESSFUL. HOST: ${mongoose.connection.host}`
          .green
      );
      this.isConnected = true;
    });
    mongoose.connection.on('error', () => {
      console.log(`❌ MONGODB CONNECTION ERROR.`.red);
      this.isConnected = false;
      //   return this.handleError.bind(this);
      return this.handleError();
    });
    mongoose.connection.on('disconnected', () => {
      console.log(`⚠️ MONGODB CONNECTION ERROR. ATTEMPING RECONNECT...`.yellow);
      //   return this.handleAppDisconnect.bind(this);
      return this.handleAppDisconnect();
    });

    // handle app termination
    process.on('SIGTERM', this.handleAppTermination.bind(this));
  }

  async connect() {
    try {
      if (!process.env.MONGO_URI) {
        throw new Error(`MONGODB URL NOT FOUND`);
      }
      // try to connect to mongodb
      await mongoose.connect(process.env.MONGO_URI);
      this.retryCount = 0; // if successful set retyCount to 0
    } catch (error) {
      console.log(error.message);
      return this.handleError();
    }
  }

  async handleError() {
    if (this.retryCount < MAX_RETRIES) {
      this.retryCount += 1;
      console.log(
        `Retrying Connection. Attempt ${this.retryCount} of ${MAX_RETRIES}`
      );
      await new Promise((resolve) =>
        setTimeout(() => {
          resolve();
        }, RETRY_INTERVAL)
      );
      return this.connect();
    } else {
      console.log(`FAILED TO CONNECT AFTER ${MAX_RETRIES} Attempts.`);
      process.exit(1);
    }
  }

  async handleAppDisconnect() {
    if (!this.isConnected) {
      console.log(`DB DISCONNECTED! RECONNECTION...`);
      return this.connect();
    }
  }

  async handleAppTermination() {
    try {
      await mongoose.connection.close();
      process.exit(0);
    } catch (error) {
      console.log(error.message);
      process.exit(1);
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    };
  }
}

// create singleton by passing dbConnection as context for bind.
const dbConnection = new DBConnection();
export default dbConnection.connect.bind(dbConnection);
export const getDBStatus = dbConnection.getConnectionStatus.bind(dbConnection);
