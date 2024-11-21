import { Injectable, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DatabaseService implements OnModuleInit {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async onModuleInit() {
    try {
      const client = await this.pool.connect();
      console.log('Database connected successfully');
      client.release();
    } catch (error) {
      console.error('Database connection error', error);
      throw error;
    }
  }

  // Método para executar consultas SQL
  async query(text: string, params?: any[]) {
    const client = await this.pool.connect();
    try {
      const res = await client.query(text, params);
      return res;
    } finally {
      client.release();
    }
  }
}
