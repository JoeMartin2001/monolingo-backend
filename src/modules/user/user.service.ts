import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserInput: CreateUserInput) {
    return this.userRepository.save(createUserInput);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  findByGoogleId(googleId: string) {
    return this.userRepository.findOne({ where: { googleId } });
  }

  update(id: string, updateUserInput: UpdateUserInput) {
    return this.userRepository.update(id, updateUserInput);
  }

  remove(id: string) {
    return this.userRepository.delete(id);
  }
}
