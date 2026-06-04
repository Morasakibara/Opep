import { DataSource } from 'typeorm';
import { User } from './modules/users/entities/user.entity';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../../.env') });

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User],
});

async function check() {
  await dataSource.initialize();
  const count = await dataSource.getRepository(User).count();
  const users = await dataSource.getRepository(User).find();
  console.log(`User count: ${count}`);
  console.log('Users:', users.map(u => ({ phone: u.phone, email: u.email, role: u.role })));
  process.exit(0);
}

check();
