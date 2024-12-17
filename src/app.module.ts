import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ProxyMiddleware } from './gateway/proxy.middleware';
import { RoutingService } from './gateway/routing.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env', // .env 파일 경로 설정
      isGlobal: true,      // 전역으로 사용 설정
    }),
    // postgresql db 연동
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true',
      },
      // entity load 부분
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),

    // 사용자 정의 모듈 추가
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService, RoutingService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProxyMiddleware).forRoutes('*');
  }
}
