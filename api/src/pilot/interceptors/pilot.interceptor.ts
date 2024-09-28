import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export class PilotInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return handler.handle().pipe(map((data) => data));
    }

    return handler.handle().pipe(map((data) => data));
  }
}
