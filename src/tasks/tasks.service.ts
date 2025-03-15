import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const allTasks = await this.prisma.task.findMany();
    return allTasks;
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findFirst({ where: { id } });

    if (task) return task;

    //throw new HttpException('Essa Tarefa não Existe', HttpStatus.NOT_FOUND);
    throw new NotFoundException('Essa Tarefa não existe');
  }

  async create(createTaskDto: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: { ...createTaskDto, completed: false },
    });

    return task;
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
