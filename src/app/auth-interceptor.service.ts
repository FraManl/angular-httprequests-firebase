import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEventType,
} from '@angular/common/http';

import { tap } from 'rxjs/operators';

export class AuthInterceptorService implements HttpInterceptor {
  // interceptor are very useful when we when to group actions/ do stuff for several requests, without having to manually configure it inside posts.service for instance (such as configuring headers... handling http call syntaxes...)
  // gets executed before the http request is triggered and then resume the request
  // interact with the request
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // do something in the intercept...
    // console.log('request is on its way!');
    // to access request object, use req
    // console.log(req.url, req.body, req.headers);
    // can compare urls etc...

    // modify urls and headers like so
    // const modifiedRequest = req.clone({ url: '', headers: '' ...});
    const modifiedRequest = req.clone({
      headers: req.headers.append('Auth', ''),
    });

    // let the request continue/trdumr
    // return next.handle(req);

    // let the modified request continue/resume
    // return next.handle(modifiedRequest);

    // remember that the interceptor outputs an observable we can listen to
    // interact with the response
    // return next.handle(modifiedRequest).pipe(
    //   tap((event) => {
    //     console.log(event);
    //     if (event.type === HttpEventType.Response) {
    //       console.log('Response arrived, body data: ');
    //       console.log(event.body);
    //     }
    //   })
    // );

    return next.handle(modifiedRequest);
  }
}
