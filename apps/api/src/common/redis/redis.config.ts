import { ConfigService } from '@nestjs/config';
import type { RedisOptions } from 'ioredis';

const DEFAULT_REDIS_HOST = 'localhost';
const DEFAULT_REDIS_PORT = 6379;

export function getRedisConnectionOptions(configService: ConfigService): RedisOptions {
  const redisUrl = configService.get<string>('REDIS_URL');

  if (redisUrl) {
    return getRedisOptionsFromUrl(redisUrl);
  }

  return {
    host: configService.get<string>('REDIS_HOST', DEFAULT_REDIS_HOST),
    port: parseInteger(configService.get<string | number>('REDIS_PORT', DEFAULT_REDIS_PORT), 'REDIS_PORT', 1, 65535),
    username: emptyToUndefined(configService.get<string>('REDIS_USERNAME')),
    password: emptyToUndefined(configService.get<string>('REDIS_PASSWORD')),
    db: parseOptionalInteger(configService.get<string | number>('REDIS_DB'), 'REDIS_DB', 0),
  };
}

function getRedisOptionsFromUrl(redisUrl: string): RedisOptions {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(redisUrl);
  } catch (error) {
    throw new Error(`Invalid REDIS_URL: ${(error as Error).message}`);
  }

  const databasePath = parsedUrl.pathname.replace(/^\//, '');

  return {
    host: parsedUrl.hostname || DEFAULT_REDIS_HOST,
    port: parseInteger(parsedUrl.port || DEFAULT_REDIS_PORT, 'REDIS_URL port', 1, 65535),
    username: parsedUrl.username ? decodeURIComponent(parsedUrl.username) : undefined,
    password: parsedUrl.password ? decodeURIComponent(parsedUrl.password) : undefined,
    db: databasePath ? parseInteger(databasePath, 'REDIS_URL database', 0) : undefined,
  };
}

function parseOptionalInteger(
  value: string | number | undefined,
  label: string,
  minValue: number,
): number | undefined {
  if (value === undefined || value === '') {
    return undefined;
  }

  return parseInteger(value, label, minValue);
}

function parseInteger(
  value: string | number,
  label: string,
  minValue: number,
  maxValue?: number,
): number {
  const parsedValue = Number(value);
  const isInRange = parsedValue >= minValue && (maxValue === undefined || parsedValue <= maxValue);

  if (!Number.isInteger(parsedValue) || !isInRange) {
    const maxMessage = maxValue === undefined ? '' : ` and <= ${maxValue}`;
    throw new Error(`${label} must be an integer >= ${minValue}${maxMessage}`);
  }

  return parsedValue;
}

function emptyToUndefined(value?: string): string | undefined {
  return value === '' ? undefined : value;
}
