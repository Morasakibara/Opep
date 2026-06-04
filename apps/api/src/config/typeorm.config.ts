import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load from multiple potential locations
dotenv.config({ path: join(process.cwd(), '.env') });
dotenv.config({ path: join(process.cwd(), '../../.env') });
dotenv.config({ path: join(__dirname, '../../../.env') });
dotenv.config({ path: join(__dirname, '../../../../.env') });

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('CRITICAL ERROR: DATABASE_URL is not defined in environment variables');
}

console.log('--- DB Config DEBUG ---');
console.log('CWD:', process.cwd());
console.log('__dirname:', __dirname);
console.log('DATABASE_URL length:', process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0);
console.log('-----------------------');

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: dbUrl,
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  // On s'assure que si l'URL est mal parsée, on a au moins les infos de base
  // Bien que l'URL soit la méthode recommandée par TypeORM
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
