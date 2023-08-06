import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './create-user.dto';
import { ClientKafka } from '@nestjs/microservices';

@Controller('auth')
export class AuthController implements OnModuleInit {
  constructor(
    private readonly authService: AuthService,
    @Inject('AUTH_SERVICE') private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('get_user');
    this.client.subscribeToResponseOf('get_all_users');
    await this.client.connect();
  }

  @Post()
  createUser(@Body(ValidationPipe) createUserDto: CreateUserDTO) {
    return this.authService.createUser(createUserDto);
  }

  @Get(':id')
  getUser(@Body('id') id: string) {
    return this.authService.getUser(id);
  }

  @Get()
  getAllUsers() {
    return this.authService.getAllUsers();
  }
}
