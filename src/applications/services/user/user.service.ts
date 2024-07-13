import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/domains/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async user(phone: string) {
    return this.repository.user({ phone });
  }

  async users() {
    return this.repository.users({});
  }

  async createUser(data: any) {
    return this.repository.createUser(data);
  }

  async updateUser(id: string, data: any) {
    return this.repository.updateUser({ where: { id }, data });
  }

  async deleteUser(id: string) {
    return this.repository.deleteUser({ id });
  }
}
