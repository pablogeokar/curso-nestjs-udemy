import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  getTasks() {
    return this.taskService.findAll();
  }

  @Get(':id')
  findOnTask(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Post()
  createTask(@Body() body: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.taskService.create(body);
  }

  @Patch(':id')
  updateTask(@Param('id') id: string, @Body() body: any) {
    console.log('ID: ', id);
    console.log('body: ', body);
    return 'Atualiza';
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    console.log('ID ENVIADO: ', id);
    return 'Deletar a tarefa com o id ' + id;
  }
}
