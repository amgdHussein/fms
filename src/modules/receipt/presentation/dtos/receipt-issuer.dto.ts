import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { PhoneDto } from '../../../../core/dtos/phone.dto';
import { OrganizationBranchDto } from '../../../organization/presentation';
import { ReceiptIssuer } from '../../domain/entities/receipt.entity';

export class ReceiptIssuerDto implements ReceiptIssuer {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'name',
    type: String,
    required: true,
    example: 'IQRA Network',
    description: 'Issuer organization name ',
  })
  name: string;

  @ApiProperty({
    name: 'taxId',
    type: String,
    required: true,
    example: '95846541564',
    description: 'Organization taxId ',
  })
  @IsNotEmpty()
  @IsString()
  taxId: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => OrganizationBranchDto)
  @ApiProperty({
    name: 'branch',
    type: () => OrganizationBranchDto,
    required: true,
    description: 'The selected branch of the organization',
  })
  branch: OrganizationBranchDto;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    name: 'email',
    type: String,
    required: false,
    example: 'ahmed.doe@example.com',
    description: 'The business email address.',
  })
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PhoneDto)
  @ApiProperty({
    name: 'phoneNumber',
    type: () => PhoneDto,
    required: false,
    description: 'The phone number of the organization.',
  })
  phone?: PhoneDto;
}
