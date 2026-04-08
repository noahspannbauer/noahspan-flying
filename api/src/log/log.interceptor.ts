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
      map((data: any) => {
        const req = context.switchToHttp().getRequest();
        const limitData = (log: LogEntity) => {
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
        }

        if (req.headers.authorization) {
          const authHeader = req.headers.authorization;
          const token = authHeader && authHeader.split(' ')[1];
          const jwtPayload = jwtDecode(token);
          const rolesKeyName = Object.keys(jwtPayload).find((key) => key.includes('roles'));

          if (jwtPayload[rolesKeyName].includes('Flying.Read')) {
            if (data.entities) {
              const logs = data.entities.map((entity) => limitData(data.entities));

              return {
                entities: logs,
                total: data.total,
                hasNextPage: data.hasNextPage
              };
            } else {
              const log = limitData(data);

              return log;
            }
            
          } else {
            return data;
          }
        } else if (!req.headers.authorization && isPublic) {
          if (data.entities) {
            const publicData = data.entities.map((entity) => limitData(entity))
            const logs = publicData.slice(0, 5)

            return {
              entities: logs,
              total: data.total,
              hasNextPage: false
            };
          } else {
            const publicData = limitData(data);

            return publicData
          }
        }
      })
    );
  }
}
