import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { LoggerFactory } from '@aaxis/nestjs-logging';
import { AxiosExceptionFilter } from './filter';
import * as process from 'process';
import { config, liveYamlConfigPath } from './config';
import * as fs from 'fs';
import { LoggingInterceptor, TraceIdInterceptor } from './interceptor';
import * as _ from 'lodash';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

const logger = LoggerFactory.createLogger({
  enableWinstonLog: config.get('application.enableWinstonLog'),
  logLevel: config.get('application.logLevel'),
  logColor: config.get('application.logColor'),
  appName: config.get('application.name'),
});

function checkConfiguration(): void {
  logger.log('Standard allowed NODE_ENV values are: local, dev, test, staging or prod', 'Config');
  logger.log(`Actual process.env.NODE_ENV value: ${process.env.NODE_ENV}`, 'Config');
  logger.log(`Enable winston log: ${config.get('application.enableWinstonLog')}`, 'Config');
  logger.log(`Actual log level: ${config.get('application.logLevel')}`, 'Config');
  logger.log(`Actual log name: ${config.get('application.logName')}`, 'Config');
  logger.log(`Actual enable trace: ${config.get('application.enableTracing')}`, 'Config');
  if (fs.existsSync(liveYamlConfigPath)) {
    logger.log('An live config exist under liveconfig folder', 'Config');
  }
}

async function createNestApp(options, appModule) {
  const app = await NestFactory.create(appModule, {
    logger,
  });
  app.enableCors({ origin: config.get('application.corsOrigin') });
  app.enableVersioning({
    type: config.get('application.versioning.type'),
    prefix: config.get('application.versioning.prefix'),
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  const clsService = app.get(ClsService);
  app.useGlobalFilters(new AxiosExceptionFilter(logger, httpAdapter));
  app.useGlobalInterceptors(new LoggingInterceptor(clsService), new TraceIdInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  _.templateSettings.interpolate = /{([\s\S]+?)}/g;
  await app.listen(options.port);
  logger.log(`${options.appName} Application listening on port ${options.port}`, 'Main');
}

async function bootstrap() {
  checkConfiguration();
  await createNestApp(
    {
      appName: config.get('application.name'),
      port: config.get('server.port'),
      defaultVersion: config.get('application.restPath'),
    },
    AppModule,
  );
  logger.debug(`Application memory used: ${JSON.stringify(process?.memoryUsage())}`, 'Main');
}

bootstrap();
