import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connections } from './entities/connections.entity';
import { User } from './entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Connections, User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
