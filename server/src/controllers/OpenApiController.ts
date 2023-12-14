import { Get, JsonController } from 'routing-controllers';
import createSpec from '../integration/openApi/createSpec';

@JsonController()
class OpenApiController {
  @Get('/spec.json')
    async getJsonSpec() {
        return createSpec();
    }

}

export default OpenApiController;