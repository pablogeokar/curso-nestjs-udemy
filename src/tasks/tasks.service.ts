import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: 1,
      name: 'Seguir o Sujeito Proigramador',
      description: 'Aprendendo muito',
      completed: false,
    },
  ];

  findAll() {
    return this.tasks;
  }

  findOne(id: string) {
    const task = this.tasks.find((task) => task.id === Number(id));

    if (task) return task;

    //throw new HttpException('Essa Tarefa não Existe', HttpStatus.NOT_FOUND);
    throw new NotFoundException('Essa Tarefa não existe');
  }

  create(createTaskDto: CreateTaskDto) {
    const newId = this.tasks.length + 1;

    const newTask = {
      id: newId,
      ...createTaskDto,
      completed: false,
    };

    this.tasks.push(newTask);

    return createTaskDto;
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    const taskIndex = this.tasks.findIndex((task) => task.id === Number(id));

    if (taskIndex < 0) {
      throw new HttpException('Essa Tarefa não existe', HttpStatus.NOT_FOUND);
    }

    const taskItem = this.tasks[taskIndex];

    this.tasks[taskIndex] = {
      ...taskItem,
      ...updateTaskDto,
    };

    return this.tasks[taskIndex];
  }

  delete(id: string) {
    const taskIndex = this.tasks.findIndex((task) => task.id === Number(id));

    if (taskIndex < 0) {
      throw new HttpException('Essa Tarefa não existe', HttpStatus.NOT_FOUND);
    }

    this.tasks.splice(taskIndex, 1);
    return {
      message: 'Tarefa excluída com sucesso',
    };
  }
}
