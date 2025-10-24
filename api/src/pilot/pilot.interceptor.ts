import { CallHandler, ExecutionContext, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import { jwtDecode } from 'jwt-decode';
import { Observable, map } from 'rxjs';
import { CustomJwtPayload } from 'src/interfaces/customJwtPayload.interface';
import { PilotEntity } from './pilot.entity';

export class PilotInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const jwtPayload: CustomJwtPayload = jwtDecode(token);

    return handler.handle().pipe(
      map((data: PilotEntity[]) => {
        if (data.length && jwtPayload.roles.includes('Flying.Read')) {
          const pilots = data.map((pilot) => {
            return {
              id: pilot.id,
              name: pilot.name
            };
          });

          return pilots;
        } else if (data.length && jwtPayload.roles.includes('Flying.Write')) {
          return data;
        } else {
          return UnauthorizedException;
        }
      })
    );
  }
}
