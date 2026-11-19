import Redis from "ioredis";
import { ICacheProvider } from "./cache.interface";
interface IRedisConfig {
  host: string;
  port: number;
  password: string;
}
export class RedisCacheProvider implements ICacheProvider {
  private client : Redis;
  constructor(config: IRedisConfig) {
    this.client = new Redis({
      host: config.host,
      port: Number(config.port),
      password: config.password,
      lazyConnect: true,
      maxLoadingRetryTime: 3,
      tls: {},
    });
    this.client.on("error", (err) =>
      console.log("Redis server error:", err.message),
    );
    this.client
      .connect()
      .catch((err) => console.log("Failed connection to Redis", err.message));
  }

  async set(key:string, value:string, ttl:number) {
    return this.client.set(key, value, "EX", ttl);
  }
  async get(key:string) {
    return this.client.get(key);
  }
  async del(key:string) {
    return this.client.del(key);
  }
  async ttl(key:string) {
    return this.client.ttl(key);
  }
}
