// json.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JsonService {
  private readonly jsonPath = path.join(__dirname, 'telasjson.json');

  searchModel(model: string): any[] {
    const data = fs.readFileSync(this.jsonPath, 'utf-8');
    const products = JSON.parse(data);
    const normalizedModel = model.toLowerCase().trim();
    return products.filter(product =>
      product.description.toLowerCase().includes(normalizedModel),
    );
  }
}
