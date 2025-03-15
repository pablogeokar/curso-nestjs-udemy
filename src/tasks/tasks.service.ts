import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  findAll() {
    return [{ id: 1, task: 'Comprar pão' }];
  }

  findOne(id: string) {
    return 'buscar tarefa com id ' + id;
  }

  create(body: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return body;
  }
}
