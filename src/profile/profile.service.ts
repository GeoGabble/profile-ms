import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { LoggerService } from 'src/global/logger.service';
import { User } from 'src/user/entities/user.entity';
import { Connections } from 'src/user/entities/connections.entity';

@Injectable()
export class ProfileService { 
  constructor(@InjectRepository(Profile) private readonly profileRepository: Repository<Profile>,@InjectRepository(Connections) private readonly connectionRepository: Repository<Connections>, private readonly logger: LoggerService){}

  async create(createProfileDto: CreateProfileDto) {
    try{
      if(createProfileDto.user.avatar_hq_url===undefined || createProfileDto.user.avatar_lq_url===undefined){
        createProfileDto.user.avatar_hq_url="https://geogabble-user-profile-images.s3.ap-south-1.amazonaws.com/original/default.png";
        createProfileDto.user.avatar_lq_url="https://geogabble-user-profile-images.s3.ap-south-1.amazonaws.com/original/default.png";
      }
      console.log(createProfileDto);
      const user= new User({...createProfileDto.user});
      console.log(user);
      const profile = new Profile({...createProfileDto, user: user});
      console.log(profile);
      await this.profileRepository.save(profile);
      return "Profile created successfully";
    }catch(error){
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error creating profile.`, error.stack);
      throw new InternalServerErrorException('An error occurred while creating the profile');
    }
  }

  async findOne(id: string, user_id: string) {
    try{
      const profile = await this.profileRepository.findOne({where: {user_id: id}, relations: ['user']});
    if(profile===null){
      this.logger.log(`Profile not found for user ID ${id}`);
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }else{
      const connection = await this.connectionRepository.findOne({where: {user1_id: user_id, user2_id: id}});
      if(connection!==null){
        if(connection.status===0){
          return {
           ...profile,
            connected_status: 0
          }
        }else{
          return {
           ...profile,
            connected_status: 1
          }
        }
      }
      return {
        ...profile,
        connected_status: 2
      };
    }
    }catch (error){
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error fetching profile for user ID ${id}:`, error.stack);
      throw new InternalServerErrorException('An error occurred while fetching the profile');
    }
  }

  async update(id: string, updateProfileDto: UpdateProfileDto) {
    try{
      const profile = await this.profileRepository.findOne({where: {user_id: id}, relations:['user']});
    const updatedProfile = {
     ...profile,
      user: {
        ...profile.user,
        ...updateProfileDto.user
      },
     ...updateProfileDto
    }
    return await this.profileRepository.save(updatedProfile);
    }catch(error){
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error updating profile for user ID ${id}:`, error.stack);
      throw new InternalServerErrorException('An error occurred while updating the profile');
    }
    
  }

  async remove(id: string) {
    try{
      const profile = await this.profileRepository.findOne({where: {user_id: id}});
      if(profile===null){
        this.logger.log(`Profile not found for user ID ${id}`);
        throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      }else{
        await this.profileRepository.remove(profile);
        return "Profile removed successfully";
      }
    }catch(error){
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error removing profile for user ID ${id}:`, error.stack);
      throw new InternalServerErrorException('An error occurred while removing the profile');
    }
  }
}
