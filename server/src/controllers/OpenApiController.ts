import { Get, JsonController, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';

@JsonController()
class OpenApiController {
  @Get('/spec.json')
    async getJsonSpec() {
        const storage = getMetadataArgsStorage();
        const schemas = validationMetadatasToSchemas({
            refPointerPrefix: '#/components/schemas/',
        });
        
        const spec = routingControllersToSpec(storage, {
            routePrefix: '/api',
        }, {
            // @ts-expect-error schema type conflict
            components: { schemas },
            info: { title: 'Edithing', version: '1.0.0' },
        });

        return spec;
    }

}

export default OpenApiController;