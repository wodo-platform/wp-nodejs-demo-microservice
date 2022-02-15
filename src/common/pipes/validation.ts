import Ajv from "ajv";
import Ajv2019 from "ajv/dist/2019"
import {demoCreateValidationSchema} from "../../demo/dto/demo.create.dto.schema";
import {demoUpdateValidationSchema} from "../../demo/dto/demo.update.dto.schema";
import {createDemoUserValidationSchema} from "../../demo-user/dto/create-demo-user.dto.schema"
import {updateDemoUserValidationSchema} from "../../demo-user/dto/update-demo-user.dto.schema"


export const ajv = new Ajv2019();

export const VALIDATION_SCHEMA_DEMO_CREATE = "validation.schema.demo.create";
export const VALIDATION_SCHEMA_DEMO_UPDATE = "validation.schema.demo.update";
export const VALIDATION_SCHEMA_DEMO_USER_CREATE = "validation.schema.demo.user.create";
export const VALIDATION_SCHEMA_DEMO_USER_UPDATE = "validation.schema.demo.user.update";

ajv.addSchema(demoCreateValidationSchema, VALIDATION_SCHEMA_DEMO_CREATE);
ajv.addSchema(demoUpdateValidationSchema, VALIDATION_SCHEMA_DEMO_UPDATE);
ajv.addSchema(createDemoUserValidationSchema, VALIDATION_SCHEMA_DEMO_USER_CREATE)
ajv.addSchema(updateDemoUserValidationSchema, VALIDATION_SCHEMA_DEMO_USER_UPDATE)


