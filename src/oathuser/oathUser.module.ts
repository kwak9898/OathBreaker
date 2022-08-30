import { Module } from '@nestjs/common';
import { OathUserController } from './oathUser.controller';
import { OathUserService } from './oathUser.service';

@Module({
  controllers: [OathUserController],
  providers: [OathUserService]
})
export class OathUserModule {}
