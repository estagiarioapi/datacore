import { Injectable } from '@nestjs/common';
import { Logger } from 'src/crosscuting/decorators/logger';
import { assembleUrl } from 'src/crosscuting/util/http';
import { isProduction } from 'src/infra/configuration/configuration';
import { MessageTemplate } from './enum/messageTemplate';

@Injectable()
export class WhatsAppService {
  private readonly apiUrl: string = isProduction()
    ? 'https://f0hvd5xnvj.execute-api.us-east-1.amazonaws.com/dev/'
    : 'http://localhost:3001/';

  @Logger()
  async sendMessageTemplate(
    phoneNumber: string,
    modelName: MessageTemplate,
    parameters?: any,
  ) {
    const url = assembleUrl(this.apiUrl, 'event/sendMessageTemplate');
    const body = JSON.stringify({ phoneNumber, modelName, parameters });
    console.log(url, body);

    fetch(url, {
      body,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (data) => console.log(await data.text()))
      .catch((error) => console.error(error));
  }
}
