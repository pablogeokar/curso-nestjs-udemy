import { Module } from '@nestjs/common';
// import { MulterModule } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
//import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    // MulterModule.register({
    //   storage: diskStorage({
    //     destination: './uploads',
    //     filename: (req, file, callback) => {
    //       const uniqueSuffix =
    //         Date.now() + '-' + Math.round(Math.random() * 1e9);
    //       const extension = file.originalname.split('.').pop();
    //       callback(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
    //     },
    //   }),
    // }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
