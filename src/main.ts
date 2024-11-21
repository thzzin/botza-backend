import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita o CORS (caso queira permitir acesso de outros domínios)
  app.enableCors({
    origin: '*', // ou restrinja para um domínio específico
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });

  // Configura o body parser para aceitar requisições maiores
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Inicia o servidor na porta configurada (padrão 3005)
  await app.listen(process.env.PORT ?? 3010);
}
bootstrap();
