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

  async create(createTaskDto: CreateTaskDto) {
    try {
      console.log('createTaskDto', createTaskDto);
      const task = await this.prisma.task.create({
        data: { ...createTaskDto, completed: false },
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

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const findTask = await this.prisma.task.findFirst({ where: { id } });

    if (!findTask) {
      throw new HttpException('Essa Tarefa não existe', HttpStatus.NOT_FOUND);
    }
    const task = await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });

    return task;
  }

  async delete(id: number) {
    const findTask = await this.prisma.task.findFirst({ where: { id } });

    if (!findTask) {
      throw new HttpException('Essa Tarefa não existe', HttpStatus.NOT_FOUND);
    }

    await this.prisma.task.delete({ where: { id } });

    return {
      message: 'Tarefa excluída com sucesso',
    };
  }
}
