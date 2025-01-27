import 'reflect-metadata';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { NODE_ENV, PORT, LOG_FORMAT } from './config';
import { Routes } from '@interfaces/routes.interface';
import { createServer } from 'https';
import { Logger } from './utils/logger';
import { ErrorMiddleware } from './middlewares/error.middleware';
import sequelize from './database/sequelize';

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public server: any;
  public io: any;
  public http: any;
  public httpServer: any;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;
    this.app.set('port', this.port);
    this.httpServer = createServer(this.app);
    this.http = require('http').Server(this.app);
    this.app.use(helmet());
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
    this.initializeSequelize()
  }

  public async listen() {
    await new Promise((resolve, reject) => {
      this.http
        .listen(this.port, () => {
          console.log(`==========================================`);
          console.log(`========== ENV: ${this.env} ==============`);
          Logger.info(`=== 🚀 App listening on the port ${this.port} ===`);
          console.log(`==========================================`);
          resolve(true);
        })
        .on('error', error => {
          Logger.error('Port is already in use!', error);
          reject(error);
        });
    });
  }

  public getServer() {
    return this.app;
  }


  private initializeMiddlewares() {
    this.app.use(cors({ origin: '*', credentials: false }));
    this.app.use(hpp());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.disable('x-powered-by');

  }



  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/api/v1', route.router);
    });

    this.app.get('/ping', (_req, res) => {
      return res.status(200).send('pong');
    });
    this.app.use('*', this.routHandler);
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    this.app.get('/ping', (req, res) => {
      return res.status(200).send('pong');
    });
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }
  private async initializeSequelize() {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }
  private routHandler(_req: Request, res: Response) {
    res.status(404).json({ message: 'Route not found' });
  }
}
