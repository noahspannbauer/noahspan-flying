import { CallHandler, ExecutionContext, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { LogEntity } from './log.entity';
import { jwtDecode } from 'jwt-decode';
import { IS_PUBLIC_KEY } from '@noahspan/noahspan-modules';
import { Reflector } from '@nestjs/core';

export class LogInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}
  
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return handler.handle().pipe(
      map((data: LogEntity[]) => {
        const req = context.switchToHttp().getRequest();
        const limitData = (data) => {
          return data.map((log: LogEntity) => {
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
        }

        if (req.headers.authorization) {
          const authHeader = req.headers.authorization;
          const token = authHeader && authHeader.split(' ')[1];
          const jwtPayload = jwtDecode(token);
          const rolesKeyName = Object.keys(jwtPayload).find((key) => key.includes('roles'));

          if (jwtPayload[rolesKeyName].includes('Flying.Read')) {
            const logs = limitData(data);

            return logs;
          } else {
            return data;
          }
        } else if (!req.headers.authorization && isPublic) {
          const publicData = limitData(data)
          const logs = publicData.slice(0, 5)

          return logs;
        }
      })
    );
  }
}
