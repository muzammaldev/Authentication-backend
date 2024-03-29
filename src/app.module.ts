import { Module } from '@nestjs/common';
import { UserModule } from './user/user.mdule';
import * as dotenv from 'dotenv';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

dotenv.config();
@Module({
  imports: [MongooseModule.forRoot(process.env.DB_URL), UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
