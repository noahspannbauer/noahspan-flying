import { CallHandler, ExecutionContext, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { LogEntity } from './log.entity';
import { jwtDecode } from 'jwt-decode';
import { CustomJwtPayload } from 'src/interfaces/customJwtPayload.interface';

export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const jwtPayload: CustomJwtPayload = jwtDecode(token);

    return handler.handle().pipe(
      map((data: LogEntity[]) => {
        if (data.length > 0 && jwtPayload.roles.includes('Flying.Read')) {
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
            };
          });

          return logs;
        } else {
          return data;
        }
      })
    );
  }
}
