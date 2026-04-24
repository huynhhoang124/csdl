import { Sequelize } from 'sequelize';
import fs from 'node:fs';
import path from 'node:path';

const env = process.env.NODE_ENV ?? 'development';
const configPath = path.resolve(process.cwd(), 'config/config.json');
const raw = JSON.parse(fs.readFileSync(configPath, 'utf-8')) as Record<string, unknown>;
const cfg = raw[env] as {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: 'mssql';
  dialectOptions?: object;
  logging?: boolean;
};

export const sequelize = new Sequelize(cfg.database, cfg.username, cfg.password, {
  host: cfg.host,
  port: cfg.port,
  dialect: cfg.dialect,
  dialectOptions: cfg.dialectOptions,
  logging: cfg.logging ?? false,
});
