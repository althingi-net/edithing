import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';

const createSpec = async () => {
    const storage = getMetadataArgsStorage();
    const schemas = validationMetadatasToSchemas({
        refPointerPrefix: '#/components/schemas/',
    });
    
    const spec = routingControllersToSpec(storage, {
        routePrefix: '/api',
    }, {
        openapi: '3.0.0',
        components: {
            // @ts-expect-error schema type conflict
            schemas,
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        info: { title: 'Edithing', version: '1.0.0' },
    });

    return spec;
};

export default createSpec;