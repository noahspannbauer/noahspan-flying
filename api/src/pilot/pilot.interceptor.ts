import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { jwtDecode } from 'jwt-decode';
import { Observable, map } from 'rxjs';
import { PilotEntity } from './pilot.entity';
import { IS_PUBLIC_KEY } from '@noahspan/noahspan-modules';
import { Reflector } from '@nestjs/core';

export class PilotInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}
  
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return handler.handle().pipe(
      map((data: PilotEntity[]) => {
        const req = context.switchToHttp().getRequest();
        const limitData = (data) => {
          return data.map((pilot: PilotEntity) => {
            return {
              id: pilot.id,
              name: pilot.name
            };
          })
        }

        if (req.headers.authorization) {
          const authHeader = req.headers.authorization;
          const token = authHeader && authHeader.split(' ')[1];

          const jwtPayload = jwtDecode(token);
          const rolesKeyName = Object.keys(jwtPayload).find((key) => key.includes('roles'));

          if (jwtPayload[rolesKeyName].includes('Flying.Read')) {
            const pilots = limitData(data)

            return pilots;
          } else {
            return data;
          }
        } else if (!req.headers.authorization && isPublic) {
          const publicData = limitData(data);
          const logs = publicData.slice(0,5)

          return logs;
        }
      })
    );
  }
}
