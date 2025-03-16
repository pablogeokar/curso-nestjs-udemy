import {
  ExecutionContext,
  NestInterceptor,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class BodyTaskInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { method, url, body } = request;

    console.log(`[REQUEST] ${method} ${url}`);
    console.log(`[BODY] ${JSON.stringify(body, null, 2)}`);

    return next.handle();
  }
}
