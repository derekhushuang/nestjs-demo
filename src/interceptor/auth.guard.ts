import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const apiScopes = this.reflector.get<string[]>('apiScopes', context.getHandler());
    if (!apiScopes) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { authorization }: any = request.headers;
    if (!authorization || authorization.trim() === '') {
      throw new UnauthorizedException('Please provide token');
    }
    const token = authorization?.replace('Bearer ', '');
    const payload = jwt.decode(token);
    return this.matchApiScopes(apiScopes, payload.scope);
  }

  matchApiScopes(apiScopes: string[], tokenScope: string) {
    return apiScopes.includes(tokenScope);
  }
}
