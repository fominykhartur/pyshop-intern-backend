import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UserDTO } from 'src/dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async updateInfo(dto: UserDTO) {
    console.log(dto);
    return await this.databaseService.user.update({
      where: { id: dto.id },
      data: {
        name: dto.name,
        telNumber: dto.telNumber,
        address: dto.address,
        info: dto.info,
      },
    });
  }

  async getUserInfo(id: number) {
    return await this.databaseService.user.findUnique({
      where: { id: id },
    });
  }
}
