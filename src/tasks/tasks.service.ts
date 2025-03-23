import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(paginationDto?: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto || {};

    const allTasks = await this.prisma.task.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return allTasks;
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findFirst({ where: { id } });

    if (task) return task;

    //throw new HttpException('Essa Tarefa não Existe', HttpStatus.NOT_FOUND);
    throw new NotFoundException('Essa Tarefa não existe');
  }

  async create(createTaskDto: CreateTaskDto, tokenPayload: PayloadTokenDto) {
    try {
      console.log('createTaskDto', createTaskDto);
      const task = await this.prisma.task.create({
        data: {
          name: createTaskDto.name,
          description: createTaskDto.description,
          completed: false,
          userId: tokenPayload.sub,
        },
      });

      return task;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Falha ao cadastrar tarefa',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
    tokenPayload: PayloadTokenDto,
  ) {
    const findTask = await this.prisma.task.findFirst({ where: { id } });

    if (!findTask) {
      throw new HttpException('Essa Tarefa não existe', HttpStatus.NOT_FOUND);
    }

    if (findTask.userId !== tokenPayload.sub) {
      throw new HttpException(
        'Você não é o proprietário da tarefa',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const task = await this.prisma.task.update({
      where: { id },
      data: {
        name: updateTaskDto.name ? updateTaskDto.name : findTask.name,
        description: updateTaskDto.description
          ? updateTaskDto.description
          : findTask.description,
        completed: updateTaskDto.completed
          ? updateTaskDto.completed
          : findTask.completed,
      },
    });

    return task;
  }

  async delete(id: number, tokenPayload: PayloadTokenDto) {
    const findTask = await this.prisma.task.findFirst({ where: { id } });

    if (!findTask) {
      throw new HttpException('Essa Tarefa não existe', HttpStatus.NOT_FOUND);
    }

    if (findTask.userId !== tokenPayload.sub) {
      throw new HttpException(
        'Você não é o proprietário da tarefa',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.prisma.task.delete({ where: { id } });

    return {
      message: 'Tarefa excluída com sucesso',
    };
  }
}
