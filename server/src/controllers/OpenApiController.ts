import { Get, JsonController, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';


@JsonController()
class OpenApiController {
  @Get('/spec.json')
    async getJsonSpec() {
        const storage = getMetadataArgsStorage();
        const spec = routingControllersToSpec(storage, {
            routePrefix: '/api',
        });
        return spec;
    }

}

export default OpenApiController;