import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return handler.handle().pipe(
        map((data) => {
          if (data.length) {
            const logs = data.map((log) => {
              return {
                partitionKey: log.partitionKey,
                rowKey: log.rowKey,
                id: log.id,
                pilotId: log.pilotId,
                pilotName: log.pilotName,
                date: log.date,
                aircraftMakeModel: log.aircraftMakeModel,
                routeFrom: log.routeFrom,
                routeTo: log.routeTo,
                durationOfFlight: log.durationOfFlight,
                notes: log.notes
              };
            });

            return logs;
          } else {
            return data;
          }
        })
      );
    }

    return handler.handle().pipe(map((data) => data));
  }
}
