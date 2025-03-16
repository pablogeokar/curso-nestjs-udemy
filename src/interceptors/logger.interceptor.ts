import {
  ExecutionContext,
  NestInterceptor,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const method = request?.method;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const url = request.url;
    const now = Date.now();

    console.log(`[REQUEST] ${method} ${url} - Início da rq`);

    return next.handle().pipe(
      tap(() => {
        console.log(`[RESPONSE] ${method} ${url} = ${Date.now() - now}ms`);
      }),
    );
  }
}
