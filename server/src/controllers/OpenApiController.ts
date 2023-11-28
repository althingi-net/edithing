import { Get, JsonController, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';


@JsonController()
class OpenApiController {
  @Get('/spec')
    async getSpec() {
        const storage = getMetadataArgsStorage();
        const spec = routingControllersToSpec(storage);
        return spec;
    }
}

export default OpenApiController;