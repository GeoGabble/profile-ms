import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Headers } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { HttpExceptionFilter } from 'src/helper/filters/exception.filter';
import { TransformInterceptor } from 'src/helper/interceptors/transform.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageService } from './upload-image.service';


@Controller('profile')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(TransformInterceptor)
export class ProfileController {
  constructor(private readonly profileService: ProfileService, private readonly uploadService: UploadImageService) {}

  @Post('new')
  async create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Post('/new/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async createAvatar(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({maxSize: 3000000}),
        new FileTypeValidator({fileType: 'image/png'})
      ]
    })
  ) file: Express.Multer.File, @Headers() headers: any) {
    return await this.uploadService.upload(headers['x-user-id'].toString(),file.buffer, file.mimetype);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Headers() headers: any) {
    return this.profileService.findOne(id, headers['x-user-id'].toString());
  }

  @Patch('/update')
  update(@Body() updateProfileDto: UpdateProfileDto, @Headers() headers: any) {
    return this.profileService.update(headers['x-user-id'].toString(), updateProfileDto);
  }

  @Delete('/delete')
  remove(@Headers() headers: any) {
    return this.profileService.remove(headers['x-user-id'].toString());
  }
}
