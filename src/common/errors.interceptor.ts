import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Observable, throwError, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WGExceptionMessage } from '@wodo-platform/wg-shared-lib/dist/wodogaming/error/wg.exception.message';
import { WGError } from '@wodo-platform/wg-shared-lib/dist/wodogaming/error/wg.error';
import { WG_ERROR_INTERNAL_SERVER, WG_ERROR_WG_VALIDATION, WG_ERROR_GL_NOT_FOUND} from '@wodo-platform/wg-shared-lib/dist/wodogaming/error/error.codes';




/**
 * Generic error interceptor to intercept errors including (@link WGError) and convert them meaningful HttpExceptions.
 * The interceptor is used with http controller in Nest framework. For that reason, all errors are bundled into HttpException.
 * 
 * Other controllers and transfports should implement different interfeptors in order to do proper exception handling.
 * 
 * Each microservice or modules implemented with nodejs & nest framework should configure and anable the interceptor in their module definitions
 * 
 * ```nodejs
 *  providers: [
 *   {
 *     provide: APP_INTERCEPTOR,
 *     useClass: ErrorsInterceptor,
 *   }, 
 *   AppService
 *  ]
 * ```
 */
@Injectable()
export class ErrorsInterceptor implements NestInterceptor {

    private readonly logger = new Logger(ErrorsInterceptor.name);


    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        //this.logger.debug('start-class:'+context.getClass().name +"->"+context.getHandler().name);

        //const now = Date.now();
        return next
        .handle()
        .pipe(
            //tap(() => this.logger.debug(`start-class:after... ${Date.now() - now}ms`)),
            catchError(
                err => throwError(() => {
                    this.logger.log(JSON.stringify(err));
                    let http_status: number = HttpStatus.INTERNAL_SERVER_ERROR;

                    if (err instanceof WGError) {
                        this.logger.log("Error is instance of WPError");
                        let wge: WGError = err as WGError;

                        switch (wge.getErrorCode().code) {
                            case WG_ERROR_GL_NOT_FOUND.code:
                                http_status = HttpStatus.NOT_FOUND;
                                break;
                            default:
                                http_status = HttpStatus.INTERNAL_SERVER_ERROR;
                                break;
                        }
                        return new HttpException(new WGExceptionMessage(http_status, wge.message, wge.getErrorCode().code, wge.stack ? wge.stack : ""), http_status);
                    }
                    else if (err instanceof HttpException)
                        // TODO: maybe not in our own json message format if frameworks throws https exceptions?
                        return err;
                    else {
                        return new HttpException(new WGExceptionMessage(http_status, err.meesage, WG_ERROR_INTERNAL_SERVER.code, err.stack), http_status);
                    }
                }
                )
            )
        );
    }
}
