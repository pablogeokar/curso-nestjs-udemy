import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Task } from './entities/task.entity';

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

  create(body: any) {
    const newId = this.tasks.length + 1;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const newTask = {
      id: newId,
      ...body,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.tasks.push(newTask);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return body;
  }

  update(id: string, body: any) {
    const taskIndex = this.tasks.findIndex((task) => task.id === Number(id));

    if (taskIndex < 0) {
      throw new HttpException('Essa Tarefa não existe', HttpStatus.NOT_FOUND);
    }

    const taskItem = this.tasks[taskIndex];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.tasks[taskIndex] = {
      ...taskItem,
      ...body,
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
