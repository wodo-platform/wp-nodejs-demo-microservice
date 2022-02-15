import { PipeTransform, ArgumentMetadata, BadRequestException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import {ajv, VALIDATION_SCHEMA_DEMO_CREATE, VALIDATION_SCHEMA_DEMO_UPDATE, VALIDATION_SCHEMA_DEMO_USER_CREATE,VALIDATION_SCHEMA_DEMO_USER_UPDATE} from "./validation"
import { DefinedError, JSONSchemaType } from 'ajv';
import { WG_ERROR_INTERNAL_SERVER, WG_ERROR_WG_VALIDATION, WG_ERROR_GL_CREATE_VALIDATION, WGErrorCode, WG_ERROR_GL_UPDATE } from '@wodo-platform/wg-shared-lib/dist/wodogaming/error/error.codes';
import { WGExceptionMessage } from '@wodo-platform/wg-shared-lib/dist/wodogaming/error/wg.exception.message';



@Injectable()
export class ValidationPipe implements PipeTransform<any> {

  private readonly logger = new Logger(ValidationPipe.name);
  private readonly validationSchema:string;

  constructor(validationSchema:string) {
    this.validationSchema = validationSchema;
    this.logger.debug("ValidationPipe is instantiated for "+validationSchema);
  }

  async transform(value, metadata: ArgumentMetadata) {

    let wgErrorCode:WGErrorCode = WG_ERROR_WG_VALIDATION;
    
    if (!value) {
      this.throwHttpException(HttpStatus.BAD_REQUEST,wgErrorCode,"Payload is empty");
    }

    const { metatype } = metadata;
    //if (!metatype || !this.toValidate(metatype)) {
    //  return value;
    //}

    //const object = plainToClass(metatype, value, null);
    let validate:any = ajv.getSchema<any>(this.validationSchema);
    const passed = validate(value);
    if (!passed) {

      if(this.validationSchema && this.validationSchema === VALIDATION_SCHEMA_DEMO_CREATE) {
        wgErrorCode = WG_ERROR_WG_VALIDATION; // indeed this is a general validation error code..we need to create it in our error catalog for any other real use case
      }
      else if(this.validationSchema && this.validationSchema === VALIDATION_SCHEMA_DEMO_UPDATE) {
        wgErrorCode = WG_ERROR_WG_VALIDATION; 
      }
      else if(this.validationSchema && this.validationSchema === VALIDATION_SCHEMA_DEMO_USER_CREATE) {
        wgErrorCode = WG_ERROR_WG_VALIDATION; 
      }
      else if(this.validationSchema && this.validationSchema === VALIDATION_SCHEMA_DEMO_USER_UPDATE) {
        wgErrorCode = WG_ERROR_WG_VALIDATION; 
      }
      else{
        wgErrorCode = WG_ERROR_INTERNAL_SERVER;
        this.throwHttpException(HttpStatus.INTERNAL_SERVER_ERROR,wgErrorCode, (this.validationSchema || this.validationSchema === "") ? "Validation schema is not provided in method validator decarator" : ("["+this.validationSchema + "] name provided in method validator decarator is not definet yet."))
      }

      let errDEtail = this.buildError(validate.errors);
      this.throwHttpException(HttpStatus.BAD_REQUEST,wgErrorCode,"property:"+ errDEtail["property"] + ", message:"+errDEtail["message"]);
    }
    return value;
  }

  private buildError(errors) {
    const result = {};
    for (const err of errors as DefinedError[]) {
      let property:any = err.instancePath;
      let message:any = err.message;
      result["property"] = property;
      result["message"] = message;
      switch (err.keyword) {
        case "maximum":
          console.log(err.params.limit)
          break
        case "pattern":
          console.log(err.params.pattern)
          break
        // ...TODO: improve the exception message details here..
      }
    }
    return result;
  }

  private throwHttpException(httpStatus: HttpStatus,wgErrorCode:WGErrorCode, details:string) {
    throw new HttpException(
      new WGExceptionMessage(
        httpStatus,
        wgErrorCode.description,
        wgErrorCode.code,
        details), 
        httpStatus);
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}