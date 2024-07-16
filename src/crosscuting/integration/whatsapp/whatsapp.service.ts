import { Injectable } from '@nestjs/common';
import { assembleUrl } from 'src/crosscuting/util/http';

@Injectable()
export class WhatsAppService {
  private readonly apiUrl: string =
    'https://f0hvd5xnvj.execute-api.us-east-1.amazonaws.com/dev/';

  async sendMessageTemplate(phone: string, modelName: string) {
    const url = assembleUrl(this.apiUrl, 'event/', { phone, modelName });
    console.log(url);

    fetch(url)
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  }
}
