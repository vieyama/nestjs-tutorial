import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SettingModule } from './setting/setting.module';
import { CustomerModule } from './customer/customer.module';
import { SupplierModule } from './supplier/supplier.module';
import { EngineerModule } from './engineer/engineer.module';
import { ForemanModule } from './foreman/foreman.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SettingModule,
    CustomerModule,
    SupplierModule,
    EngineerModule,
    ForemanModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
