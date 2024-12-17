import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

@Injectable()
export class RoutingService {
  private routes: any[];
  private resolveVariables(value: string): string { // 환경변수 매칭
    return value.replace(/\$\{([^:}]+):?([^}]*)\}/g, (_, varName, defaultValue) => {
      return process.env[varName] || defaultValue;
    });
  }

  constructor() {
    const filePath = './routes.yml';
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const yamlData = yaml.load(rawData) as any;
    this.routes = yamlData.routes.map((route: any) => ({
        ...route,
        uri: this.resolveVariables(route.uri),
      }));
  }

  getRoutes() {
    return this.routes;
  }
}
