import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { QueryDto, QueryResultDto } from '../../../../core/dtos';
import { AuthenticationGuard } from '../../../../core/guards';

import { AddUser, DeleteUser, GetUser, QueryUsers, RegisterUser, UpdateUser } from '../../application';
import { USER_USECASE_PROVIDERS } from '../../domain';

import { AddUserDto, RegisterUserDto, UpdateUserDto, UserDto } from '../dtos';

@ApiTags('Users')
@Controller('users')
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
  @ApiOperation({ summary: 'Retrieve all or filtered users with pagination.' }) // Improved operation summary
  @ApiBody({
    type: QueryDto,
    required: false,
    description: 'Optional query parameters to filter users, including sorting and pagination settings.',
  })
  @ApiResponse({
    type: QueryResultDto<UserDto>,
    description: 'A list of users that match the specified query filters and pagination settings.',
  })
  async queryUsers(@Query() query: QueryDto): Promise<QueryResultDto<UserDto>> {
    const { page, limit, filters, order } = query;
    return this.queryUsersUsecase.execute(page, limit, filters, order);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Retrieve a user by their unique ID.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    description: 'The unique identifier of the user.',
  })
  @ApiResponse({
    type: UserDto,
    description: 'The user with the specified ID.',
  })
  async getUser(@Param('id') id: string): Promise<UserDto> {
    return this.getUserUsecase.execute(id);
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user.' })
  @ApiBody({
    type: RegisterUserDto,
    required: true,
    description: 'Details required to register a new user, including ID, email, and role.',
  })
  @ApiResponse({
    type: UserDto,
    description: 'The newly registered user.',
  })
  @UseGuards(AuthenticationGuard)
  async registerUser(@Body() entity: RegisterUserDto): Promise<UserDto> {
    return this.registerUserUsecase.execute(entity.id, entity.email, entity.role);
  }

  @Post()
  @ApiOperation({ summary: 'Add a new user to the system.' })
  @ApiBody({
    type: AddUserDto,
    required: true,
    description: 'Information required to create a new user entry in the database.',
  })
  @ApiResponse({
    type: UserDto,
    description: 'The newly added user.',
  })
  @UseGuards(AuthenticationGuard)
  async addUser(@Body() entity: AddUserDto): Promise<UserDto> {
    return this.addUserUsecase.execute(entity);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user information.' })
  @ApiParam({
    name: 'id',
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    type: String,
    description: 'The unique identifier of the user to be updated.',
  })
  @ApiBody({
    type: UpdateUserDto,
    required: true,
    description: 'The user information to be updated.',
  })
  @ApiResponse({
    type: UserDto,
    description: 'The updated user details.',
  })
  async updateUser(@Param('id') id: string, @Body() entity: UpdateUserDto): Promise<UserDto> {
    return this.updateUserUsecase.execute({ ...entity, id });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by their unique ID.' })
  @ApiParam({
    name: 'id',
    example: 'K05ThPKxfugr9yYhA82Z',
    required: true,
    type: String,
    description: 'The unique identifier of the user to be deleted.',
  })
  @ApiResponse({
    type: UserDto,
    description: 'The user that was deleted.',
  })
  async deleteUser(@Param('id') id: string): Promise<UserDto> {
    return this.deleteUserUsecase.execute(id);
  }
}
