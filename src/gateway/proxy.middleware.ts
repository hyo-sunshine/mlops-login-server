import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { RoutingService } from './routing.service';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  constructor(private readonly routingService: RoutingService) {}

  use(req: any, res: any, next: () => void) {
    const routes = this.routingService.getRoutes();
    const matchingRoute = routes.find((route) =>
      route.predicates.some((predicate: string) => this.matchPredicate(predicate, req)),
    );

    if (matchingRoute) {
      const proxy = createProxyMiddleware({
        target: matchingRoute.uri,
        changeOrigin: true,
      });
      proxy(req, res, next);
    } else {
      next(); // 매칭되는 라우트가 없을 경우
    }
  }

  private matchPredicate(predicate: string, req: any): boolean {
    Logger.log(predicate);
    if (predicate.startsWith('Path=')) {
      const path = predicate.replace('Path=', '').split(',');
      return path.some((p) => req.path.startsWith(p));
    }
    // 추가적인 조건 처리 필요 시 작성
    return false;
  }
}
