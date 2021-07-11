import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SessionService } from '../services';

import { MessageConsts } from '../constants/messages.const';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private sessionService: SessionService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(tap(() => { },
      (err: any) => {
        switch (err.status) {
          case 401:
            let isAuthenticated = this.sessionService.isAuthenticated();
            if (isAuthenticated) {
              this.router.navigate(['/401']);
            }
            this.router.navigate(['/login']);
            break;
          case 500:
            err.error.message = MessageConsts.INTERNAL_SERVER_ERROR;
            break;
          default:
            return;
        }
      }));
  }
}
