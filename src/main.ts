import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';

// Caminhos para os certificados SSL gerados pelo Let's Encrypt
const privateKey = fs.readFileSync(
  '/etc/letsencrypt/live/getluvia.com.br/privkey.pem',
  'utf8',
);
const certificate = fs.readFileSync(
  '/etc/letsencrypt/live/getluvia.com.br/cert.pem',
  'utf8',
);
const ca = fs.readFileSync(
  '/etc/letsencrypt/live/getluvia.com.br/chain.pem',
  'utf8',
);

// Configuração das opções HTTPS
const httpsOptions = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

async function bootstrap() {
  // Criação da aplicação Nest.js
  const app = await NestFactory.create(AppModule);

  // Habilita CORS (opcional)
  app.enableCors({
    origin: '*', // Altere para um domínio específico em produção
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });

  // Configura body-parser para aceitar payloads maiores
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Porta HTTPS
  const HTTPS_PORT = process.env.HTTPS_PORT || 3005;

  // Criação do servidor HTTPS
  const httpsServer = https.createServer(
    httpsOptions,
    app.getHttpAdapter().getInstance(),
  );

  httpsServer.listen(HTTPS_PORT, () => {
    console.log(`HTTPS Server running on port ${HTTPS_PORT}`);
  });
}

bootstrap();
