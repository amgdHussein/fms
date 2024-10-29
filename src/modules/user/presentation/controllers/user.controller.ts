import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { QueryDto, QueryResultDto } from '../../../../core/dtos';
import { AuthenticationGuard } from '../../../../core/guards';

import { AddUser, DeleteUser, GetUser, QueryUsers, RegisterUser, UpdateUser } from '../../application';
import { USER_USECASE_PROVIDERS } from '../../domain';

import { AddUserDto, RegisterUserDto, UpdateUserDto, UserDto } from '../dtos';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthenticationGuard)
export class UserController {
  constructor(
    @Inject(USER_USECASE_PROVIDERS.GET_USER)
    private readonly getUserUsecase: GetUser,

    @Inject(USER_USECASE_PROVIDERS.ADD_USER)
    private readonly addUserUsecase: AddUser,

    @Inject(USER_USECASE_PROVIDERS.REGISTER_USER)
    private readonly registerUserUsecase: RegisterUser,

    @Inject(USER_USECASE_PROVIDERS.UPDATE_USER)
    private readonly updateUserUsecase: UpdateUser,

    @Inject(USER_USECASE_PROVIDERS.QUERY_USERS)
    private readonly queryUsersUsecase: QueryUsers,

    @Inject(USER_USECASE_PROVIDERS.DELETE_USER)
    private readonly deleteUserUsecase: DeleteUser,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all/N users with/without filter the results.' })
  @ApiBody({
    type: QueryDto,
    required: false,
    description: 'Object contains List of query params are applied on the database, sort by field, as well as number of user needed.',
  })
  @ApiResponse({
    type: QueryResultDto<UserDto>,
    description: 'List of users that meet all the query filters, and with length less than or equal to limit number.',
  })
  async queryUsers(@Query() query: QueryDto): Promise<QueryResultDto<UserDto>> {
    const { page, limit, filters, order } = query;
    return this.queryUsersUsecase.execute(page, limit, filters, order);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get User by id.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The id of the user',
  })
  @ApiResponse({
    type: UserDto,
    description: 'User with specified id.',
  })
  async getUser(@Param('id') id: string): Promise<UserDto> {
    return this.getUserUsecase.execute(id);
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register new User.' })
  @ApiBody({
    type: RegisterUserDto,
    required: true,
    description: 'User info required to create a new document into database.',
  })
  @ApiResponse({
    type: UserDto,
    description: 'User recently added.',
  })
  async registerUser(@Body() entity: RegisterUserDto): Promise<UserDto> {
    return this.registerUserUsecase.execute(entity.id, entity.email, entity.role);
  }

  @Post()
  @ApiOperation({ summary: 'Add new User.' })
  @ApiBody({
    type: AddUserDto,
    required: true,
    description: 'User info required to create a new document into database.',
  })
  @ApiResponse({
    type: UserDto,
    description: 'User recently added.',
  })
  async addUser(@Body() entity: AddUserDto): Promise<UserDto> {
    return this.addUserUsecase.execute(entity);
  }

  @Put()
  @ApiOperation({ summary: 'Update user info.' })
  @ApiBody({
    type: UpdateUserDto,
    required: true,
    description: 'Optional user info to be updated.',
  })
  @ApiResponse({
    type: UserDto,
    description: 'Updated user.',
  })
  async updateUser(@Body() entity: UpdateUserDto): Promise<UserDto> {
    return this.updateUserUsecase.execute(entity);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id.' })
  @ApiParam({
    name: 'id',
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    type: String,
    description: 'User id that required to delete the user data from database.',
  })
  @ApiResponse({
    type: UserDto,
    description: 'User deleted.',
  })
  async deleteUser(@Param('id') id: string): Promise<UserDto> {
    return this.deleteUserUsecase.execute(id);
  }
}
