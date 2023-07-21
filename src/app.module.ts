import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { SettingModule } from './setting/setting.module';
import { CustomerModule } from './customer/customer.module';
import { SupplierModule } from './supplier/supplier.module';
import { EngineerModule } from './engineer/engineer.module';
import { ForemanModule } from './foreman/foreman.module';
import { CarModule } from './car/car.module';
import { ProductModule } from './product/product.module';
import { ServiceModule } from './service/service.module';
import { ProductTransactionModule } from './product-transaction/product-transaction.module';
import { ProductSellingModule } from './product-selling/product-selling.module';
import { ServiceSellingModule } from './service-selling/service-selling.module';
import { ServiceTransactionModule } from './service-transaction/service-transaction.module';

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
    CarModule,
    ProductModule,
    ServiceModule,
    ProductTransactionModule,
    ProductSellingModule,
    ServiceSellingModule,
    ServiceTransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
