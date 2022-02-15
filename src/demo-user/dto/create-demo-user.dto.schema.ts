import {JSONSchemaType} from "ajv";
import { CreateDemoUserDto } from "./create-demo-user.dto";

export const createDemoUserValidationSchema:JSONSchemaType<CreateDemoUserDto> = {
    
    type: 'object', 
    // Type can be: number, integer, string, boolean, array, object or null. see https://ajv.js.org/json-schema.html
    properties: {
        name:      { type: "string", minLength : 1 }, 
        password:  { type: "string" }
    },
    required: ["name","password"],
    additionalProperties: false
};