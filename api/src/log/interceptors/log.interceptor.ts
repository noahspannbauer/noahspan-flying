import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { LogEntity } from '../log.entity';

export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return handler.handle().pipe(
        map((data: LogEntity[]) => {

          if (data.length) {
            const logs = data.map((log: LogEntity) => {
              return {
                id: log.id,
                pilot: {
                  name: log.pilot.name
                },
                date: log.date,
                aircraftMakeModel: log.aircraftMakeModel,
                routeFrom: log.routeFrom,
                routeTo: log.routeTo,
                durationOfFlight: log.durationOfFlight,
                tracks: log.tracks,
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
