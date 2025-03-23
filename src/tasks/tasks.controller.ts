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
  //UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
//import { LoggerInterceptor } from 'src/interceptors/logger.interceptor';
//import { BodyTaskInterceptor } from 'src/interceptors/body-create-task.interceptor';
//import { AddHeaderInterceptor } from 'src/interceptors/add-header.interceptor';
//import { AuthAdminGuard } from 'src/common/guards/admin.guard';
import { TaskUtils } from './tasks.utils';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';
import { TokenPayloadParam } from 'src/auth/param/token-payload.param';
//import { ApiExceptionFilter } from 'src/common/filters/exception-filter';

@Controller('tasks')
//@UseFilters(ApiExceptionFilter) Forma alternativa de chamar os filters, no meu caso eu chamei os filters no modulo
//@UseGuards(AuthAdminGuard) este AuthAdminGuard era um exemplo de um guard que verificava a role do usuário
export class TasksController {
  constructor(
    private readonly taskService: TasksService,

    private readonly taskUtils: TaskUtils,

    @Inject('KEY_TOKEN')
    private readonly keyToken: string,
  ) {}

  @Get()
  // @UseInterceptors(LoggerInterceptor) Simples interceptor para exibir no console dados da chamada da requisição
  // @UseInterceptors(AddHeaderInterceptor) Simples interceptor para modificar o header da requisição
  findAllTasks(@Query() paginationDto: PaginationDto) {
    //console.log(this.taskUtils.splitString('Aprender NestJs do Zero'));

    //console.log(this.keyToken);
    return this.taskService.findAll(paginationDto);
  }

  @Get(':id')
  findOneTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findOne(id);
  }

  @UseGuards(AuthTokenGuard)
  @Post()
  //@UseInterceptors(BodyTaskInterceptor) Exemplo de um simples interceptor para capturar o body da requisição
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @TokenPayloadParam() tokenPayload: PayloadTokenDto,
  ) {
    return this.taskService.create(createTaskDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @TokenPayloadParam() tokenPayload: PayloadTokenDto,
  ) {
    return this.taskService.update(id, updateTaskDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @TokenPayloadParam() tokenPayload: PayloadTokenDto,
  ) {
    return this.taskService.delete(id, tokenPayload);
  }
}
