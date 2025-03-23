import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  //Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  //UploadedFiles,
} from '@nestjs/common';
import {
  FileInterceptor /* FilesInterceptor,*/,
} from '@nestjs/platform-express';
// import * as path from 'node:path';
// import * as fs from 'node:fs/promises';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
//import { REQUEST_TOKEN_PAYLOAD_NAME } from 'src/auth/common/auth.constants';
import { TokenPayloadParam } from 'src/auth/param/token-payload.param';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';
//import { randomUUID } from 'node:crypto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  findOneUser(@Param('id', ParseIntPipe) id: number) {
    console.log('Token Key', process.env.TOKEN_KEY);
    return this.userService.findOne(id);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    //@Req() req: Request,
    @TokenPayloadParam() tokenPayload: PayloadTokenDto,
  ) {
    // Visualizando o token vindo do Request
    //console.log('ID user', req[REQUEST_TOKEN_PAYLOAD_NAME].sub);

    // Visualizando o payload vindo do parametro personalizado @TokenPayloadParam
    //console.log('PAYLOAD RECEBIDO', tokenPayload);

    return await this.userService.update(id, updateUserDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @TokenPayloadParam() tokenPayload: PayloadTokenDto,
  ) {
    return this.userService.delete(id, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /jpeg|jpg|png/g,
        })
        .addMaxSizeValidator({
          maxSize: 1 * (1024 * 1024), // Tamanho máximo 1 MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @TokenPayloadParam() tokenPayload: PayloadTokenDto,
  ) {
    return this.userService.uploadAvatarImage(tokenPayload, file);
  }

  // Exemplo fazendo o upload programando a lógica dentro do controller
  // @UseGuards(AuthTokenGuard)
  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadAvatar(
  //   @UploadedFile(
  //     new ParseFilePipeBuilder()
  //       .addFileTypeValidator({
  //         fileType: /jpeg|jpg|png/g,
  //       })
  //       .addMaxSizeValidator({
  //         maxSize: 1 * (1024 * 1024), // Tamanho máximo 1 MB
  //       })
  //       .build({
  //         errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  //       }),
  //   )
  //   file: Express.Multer.File,
  //   @TokenPayloadParam() tokenPayload: PayloadTokenDto,
  // ) {
  //   const fileExtension = path
  //     .extname(file.originalname)
  //     .toLowerCase()
  //     .substring(1);

  //   const filename = `${tokenPayload.sub}.${fileExtension}`;
  //   const fileLocale = path.resolve(process.cwd(), 'uploads', filename);

  //   // console.log(mimeType);
  //   // console.log(fileExtension);
  //   // console.log(filename);
  //   // console.log(fileLocale);
  //   // console.log(file);

  //   await fs.writeFile(fileLocale, file.buffer);

  //   return true;
  // }

  // Este exemplo envia multiplos arquivos
  // @UseGuards(AuthTokenGuard)
  // @Post('upload')
  // @UseInterceptors(FilesInterceptor('file'))
  // uploadAvatar(
  //   @UploadedFiles() files: Array<Express.Multer.File>,
  //   @TokenPayloadParam() tokenPayload: PayloadTokenDto,
  // ) {
  //   files.map((file) => {
  //     const fileExtension = path
  //       .extname(file.originalname)
  //       .toLowerCase()
  //       .substring(1);
  //     const filename = `${randomUUID()}.${fileExtension}`;
  //     const fileLocale = path.resolve(process.cwd(), 'uploads', filename);
  //     void fs.writeFile(fileLocale, file.buffer);
  //   });
  //   return true;
  // }
}
