import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { UploadImageService } from './upload-image.service';
import { Connections } from 'src/user/entities/connections.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, Connections])],
  controllers: [ProfileController],
  providers: [ProfileService, UploadImageService],
})
export class ProfileModule {}
