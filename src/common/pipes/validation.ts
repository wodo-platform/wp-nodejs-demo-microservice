import Ajv from "ajv";
import Ajv2019 from "ajv/dist/2019"
import {demoCreateValidationSchema} from "../../demo/dto/demo.create.dto.schema";
import {demoUpdateValidationSchema} from "../../demo/dto/demo.update.dto.schema";

export const ajv = new Ajv2019();

export const VALIDATION_SCHEMA_DEMO_CREATE = "validation.schema.demo.create";
export const VALIDATION_SCHEMA_DEMO_UPDATE = "validation.schema.demo.update";

ajv.addSchema(demoCreateValidationSchema, VALIDATION_SCHEMA_DEMO_CREATE);
ajv.addSchema(demoUpdateValidationSchema, VALIDATION_SCHEMA_DEMO_UPDATE);


