import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateUserDTO } from './create-user.dto';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientKafka) {}

  async createUser(createUserDto: CreateUserDTO) {
    await this.client.emit('create_user', createUserDto).toPromise();
    const data = await this.client.send('get_all_users', '').toPromise();
    console.log(data);
  }

  getUser(id: string) {
    return this.client.send('get_user', JSON.stringify({ id }));
  }

  getAllUsers() {
    this.client
      .send('get_all_users', '')
      .subscribe((data) => console.log(data));
    return [1, 2, 3];
  }
}
