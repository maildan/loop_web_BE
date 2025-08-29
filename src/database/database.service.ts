import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
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
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }

  async onModuleInit() {
    let retries = 5;
    while (retries) {
      try {
        const client = await this.pool.connect();
        console.log('Successfully connected to the database.');
        client.release();
        return;
      } catch (err) {
        console.error('Failed to connect to the database', err);
        retries -= 1;
        console.log(`Retries left: ${retries}`);
        if (retries === 0) throw err;
        await new Promise(res => setTimeout(res, 5000));
      }
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
    console.log('Database connection pool closed.');
  }

  getPool(): Pool {
    return this.pool;
  }
}

