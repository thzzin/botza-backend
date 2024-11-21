import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as https from 'https';
import * as fs from 'fs';

const privateKey = fs.readFileSync(
  "/etc/letsencrypt/live/getluvia.com.br/privkey.pem",
  "utf8"
);
const certificate = fs.readFileSync(
  "/etc/letsencrypt/live/getluvia.com.br/cert.pem",
  "utf8"
);
const ca = fs.readFileSync(
  "/etc/letsencrypt/live/getluvia.com.br/chain.pem",
  "utf8"
);

const httpsOptions = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita CORS (opcional)
  app.enableCors({
    origin: '*', // Altere para um domínio específico em produção
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });

  // Configura body-parser
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Cria o servidor HTTPS
  const server = https.createServer(httpsOptions, app.getHttpAdapter().getInstance());
  const PORT = process.env.PORT || 3010;
  server.listen(PORT, () => {
    console.log(`HTTPS Server running on port ${PORT}`);
  });
}
bootstrap();

