import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Connections } from './entities/connections.entity';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoggerService } from 'src/global/logger.service';
import { stat } from 'fs';

@Injectable()
export class UserService {
  constructor(@InjectRepository(Connections) private readonly connectionsRepository: Repository<Connections>,@InjectRepository(User) private readonly userRepository: Repository<User>, private readonly logger: LoggerService){}
  
  async newConnection(user1_id: string, user2_id: string) {
    try{
      const newConnection = new Connections({user1_id: user1_id, user2_id: user2_id, status: 0});
      await this.connectionsRepository.save(newConnection);
      return "COnnection request sent successfully.";
    }catch(error){
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error sending connection request for user IDs ${user1_id} and ${user2_id}:`, error.stack);
      throw new InternalServerErrorException('An error occurred while sending the connection request');
    }
  }

  async findConnections(user_id: string, status: number) {
    try{
      if(status===0){
        return await this.connectionsRepository.find({where: [{user1_id: user_id, status:0}, {user2_id: user_id, status:0}]});
      }else{
        return await this.connectionsRepository.find({where: {user2_id: user_id, status:1}});
      }
    }catch(error){
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error fetching connections for user ID ${user_id}:`, error.stack);
      throw new InternalServerErrorException('An error occurred while fetching the connections');
    }
  }

  async modifyConnections(connection: number, user_id: string, status: number) {
    try{
      const conn = await this.connectionsRepository.findOne({where: {connection_id: connection}});
    if((conn.user1_id!==user_id && conn.user2_id!==user_id) || (conn.user1_id===user_id && status===0)){
      throw new HttpException('Unauthorized connection modification', HttpStatus.UNAUTHORIZED);
    }else{
      if(status===0){
        conn.status=0;
        await this.connectionsRepository.save(conn);
        return "Connection approved successfully.";
      }else{
        await this.connectionsRepository.remove(conn);
        return "Connection removed/rejected successfully.";
      }
    }
    }catch(error){
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error modifying connection for user ID ${user_id}:`, error.stack);
      throw new InternalServerErrorException('An error occurred while modifying the connection');
    }
  }
}
