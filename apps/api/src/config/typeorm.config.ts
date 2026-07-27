import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Force NestJS build to compile migration files to dist/migrations/
import '../migrations/1740000000000-CreateApiErrorsTable';

[
  join(process.cwd(), '.env.local'),
  join(process.cwd(), '.env'),
  join(process.cwd(), '../../.env.local'),
  join(process.cwd(), '../../.env'),
  join(__dirname, '../../../.env.local'),
  join(__dirname, '../../../.env'),
  join(__dirname, '../../../../.env.local'),
  join(__dirname, '../../../../.env'),
].forEach((envFilePath) => dotenv.config({ path: envFilePath, quiet: true }));

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('CRITICAL ERROR: DATABASE_URL is not defined in environment variables');
}

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: dbUrl,
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
  synchronize: process.env.NODE_ENV === 'development',
  // Auto-create tables in dev for DX; always false in production
  logging: process.env.NODE_ENV === 'development',
  // On s'assure que si l'URL est mal parsée, on a au moins les infos de base
  // Bien que l'URL soit la méthode recommandée par TypeORM
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
