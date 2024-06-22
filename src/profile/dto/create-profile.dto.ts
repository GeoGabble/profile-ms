import { IsNotEmpty, IsOptional, IsUrl } from "class-validator";

export class CreateProfileDto {
    user_id: string;
    @IsNotEmpty({'always': true,message: "Please provide description"})
    description: string;
    @IsNotEmpty({'always': true,message: "Please provide location"})
    location: string;
    @IsNotEmpty({'always': true,message: "Please provide dob"})
    dob: string;
    @IsNotEmpty({'always': true,message: "Please provide gender"})
    gender: string;

    user: CreateUser
}

class CreateUser{
    @IsNotEmpty({'always': true,message: "Please provide username"})
    username: string;

    @IsUrl()
    avatar_hq_url: string ;
    @IsUrl()
    avatar_lq_url: string;
}
