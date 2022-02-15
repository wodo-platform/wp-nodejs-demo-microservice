import {JSONSchemaType} from "ajv";
import { UpdateDemoUserDto } from "./update-demo-user.dto";

export const updateDemoUserValidationSchema:JSONSchemaType<UpdateDemoUserDto> = {
    
    type: 'object', 
    // Type can be: number, integer, string, boolean, array, object or null. see https://ajv.js.org/json-schema.html
    properties: {
        id:         { type: "number" }, 
        name:         { type: "string" }, 
        password:  { type: "string" }
    },
    required: ["id","name","password"],
    additionalProperties: false
};