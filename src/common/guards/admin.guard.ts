import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 *  lembrando que o middleware é chamado primeiro, depois que o nest chama os guards
 */

@Injectable()
export class AuthAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    console.log('--------------------------');
    console.log(request['user']);
    console.log('--------------------------');

    if (request['user']?.role === 'admin') return true;

    return false; //Seguir o fluxo
  }
}
