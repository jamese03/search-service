import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class MockGoogleAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // Simulate logged-in user
    request.user = {
      id: '123',
      email: 'mockuser@gmail.com',
      name: 'Mock User',
    };
    return true;
  }
}