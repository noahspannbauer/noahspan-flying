import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export class PilotInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return handler.handle().pipe(
        map((data) => {
          if (data.length) {
            const pilots = data.map((pilot) => {
              return {
                partitionKey: pilot.partitionKey,
                rowKey: pilot.rowKey,
                id: pilot.id,
                name: pilot.name
              };
            });

            return pilots;
          } else {
            return {
              partitionKey: data.partitionKey,
              rowKey: data.rowKey,
              id: data.id,
              name: data.name
            };
          }
        })
      );
    }

    return handler.handle().pipe(map((data) => data));
  }
}
