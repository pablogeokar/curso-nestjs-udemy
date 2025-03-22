import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  //UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { LoggerInterceptor } from 'src/interceptors/logger.interceptor';
import { BodyTaskInterceptor } from 'src/interceptors/body-create-task.interceptor';
import { AddHeaderInterceptor } from 'src/interceptors/add-header.interceptor';
import { AuthAdminGuard } from 'src/common/guards/admin.guard';
import { TaskUtils } from './tasks.utils';
//import { ApiExceptionFilter } from 'src/common/filters/exception-filter';

@Controller('tasks')
//@UseFilters(ApiExceptionFilter) Forma alternativa de chamar os filters, no meu caso eu chamei os filters no modulo
@UseGuards(AuthAdminGuard)
export class TasksController {
  constructor(
    private readonly taskService: TasksService,

    private readonly taskUtils: TaskUtils,

    @Inject('KEY_TOKEN')
    private readonly keyToken: string,
  ) {}

  @Get()
  @UseInterceptors(LoggerInterceptor)
  @UseInterceptors(AddHeaderInterceptor)
  findAllTasks(@Query() paginationDto: PaginationDto) {
    //console.log(this.taskUtils.splitString('Aprender NestJs do Zero'));

    //console.log(this.keyToken);
    return this.taskService.findAll(paginationDto);
  }

  @Get(':id')
  findOneTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findOne(id);
  }

  @Post()
  @UseInterceptors(BodyTaskInterceptor)
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Patch(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.delete(id);
  }
}
