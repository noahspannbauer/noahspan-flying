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
            console.log(pilots)
            return pilots;
          } else {
            return data;
          }
        })
      );
    }

    return handler.handle().pipe(map((data) => data));
  }
}
