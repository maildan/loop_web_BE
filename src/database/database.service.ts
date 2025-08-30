import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: Pool;

  constructor(private configService: ConfigService) {
    const connectionString = this.configService.get<string>('DATABASE_URL');
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined in the environment variables');
    }

    this.pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
    });

    this.pool.on('error', (err, client) => {
      this.logger.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }

  async onModuleInit() {
    let retries = 5;
    while (retries) {
      try {
        const client = await this.pool.connect();
        this.logger.log('Successfully connected to the database.');
        client.release();
        await this.initializeDatabaseSchema();
        return;
      } catch (err) {
        this.logger.error('Failed to connect to the database', err);
        retries -= 1;
        this.logger.log(`Retries left: ${retries}`);
        if (retries === 0) throw err;
        await new Promise(res => setTimeout(res, 5000));
      }
    }
  }

  private async initializeDatabaseSchema() {
    const client = await this.pool.connect();
    try {
      this.logger.log('Initializing database schema...');

      // Create users table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          google_id VARCHAR(255) UNIQUE,
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255),
          profile_picture_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Create documents table
      await client.query(`
        CREATE TABLE IF NOT EXISTS documents (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          type VARCHAR(50) NOT NULL,
          name VARCHAR(255) NOT NULL,
          word_count INTEGER DEFAULT 0,
          reading_time INTEGER DEFAULT 0,
          last_modified TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      this.logger.log('Database schema initialized successfully.');
    } catch (err) {
      this.logger.error('Failed to initialize database schema', err);
      throw err;
    } finally {
      client.release();
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
    this.logger.log('Database connection pool closed.');
  }

  getPool(): Pool {
    return this.pool;
  }
}

