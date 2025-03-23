import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol,
  ) {}

  async findOne(id: number) {
    const user = await this.prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        Task: true,
      },
    });

    if (user) return user;

    throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const passwordHash = await this.hashingService.hash(
        createUserDto.password,
      );
      const user = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Falha ao cadastrar usuário!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    tokenPayload: PayloadTokenDto,
  ) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id },
      });

      if (!user) {
        throw new HttpException('Usuário não existe', HttpStatus.BAD_REQUEST);
      }

      if (user.id !== tokenPayload.sub) {
        throw new HttpException('Acesso Negado', HttpStatus.BAD_REQUEST);
      }

      const dataUser: { name?: string; passwordHash?: string } = {
        name: updateUserDto.name ? updateUserDto.name : user.name,
      };

      if (updateUserDto?.password) {
        const passwordHash = await this.hashingService.hash(
          updateUserDto?.password,
        );
        dataUser['passwordHash'] = passwordHash;
      }

      const updateUser = await this.prisma.user.update({
        where: { id },
        data: dataUser,
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      return updateUser;
    } catch (error) {
      console.log(error);
      // Re-throw the error so it can be caught by the exception filter
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro ao atualizar usuário',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: number, tokenPayload: PayloadTokenDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id },
      });

      if (!user) {
        throw new HttpException('Usuário não existe', HttpStatus.BAD_REQUEST);
      }

      if (user.id !== tokenPayload.sub) {
        throw new HttpException('Acesso Negado', HttpStatus.BAD_REQUEST);
      }

      await this.prisma.user.delete({ where: { id } });
      return {
        message: 'Usuário excluído com sucesso!',
      };
    } catch (error) {
      console.log(error);
      // Re-throw the error so it can be caught by the exception filter
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro ao excluir usuário',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
