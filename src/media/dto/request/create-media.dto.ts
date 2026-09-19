import { IsEnum, IsPositive, IsString, IsUUID, Max, Min } from "class-validator"
import { MediaPurposeEnum } from "../../enums/media-purpose.enum"


export class CreateMediaRequestDto {

    @IsEnum(MediaPurposeEnum)
    purpose: MediaPurposeEnum

    @IsString()
    contentType: string

    @IsPositive()
    @Min(0)
    @Max(1000000000)
    size: number
}