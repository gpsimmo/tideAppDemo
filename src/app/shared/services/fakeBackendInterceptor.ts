import { AccountItem } from './../models/account-item.model';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // array in local storage for registered users
        const accountData: AccountItem[] = [
          {id: '01', fullname: 'katie reyes', dob: '4/7/1970'},
          {id: '02', fullname: 'Lucas Castillo', dob: '7/5/1970'},
          {id: '03', fullname: 'Karl Cole', dob: '5/5/1983'},
          {id: '04', fullname: 'Greg Fields', dob: '1/1/1984'},
          {id: '05', fullname: 'aubrey duncan', dob: '8/4/1980'},
          {id: '06', fullname: 'Joy Larson', dob: '10/1/1975'},
          {id: '07', fullname: 'Hazel Anderson', dob: '5/1/1977'},
          {id: '08', fullname: 'Bonnie Ramirez', dob: '11/1/1975'},
          {id: '09', fullname: 'Alice Mills', dob: '5/5/1975'},
          {id: '10', fullname: 'Paul Bradley', dob: '11/2/1976'}
        ];

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {


            // get users
            if (request.url.endsWith('/accounts') && request.method === 'GET') {
              console.log('returned /accounts');

              return of(new HttpResponse({ status: 200, body: accountData }));
            }

            // register user
            if (request.url.endsWith('/account/update') && request.method === 'POST') {
                // respond 200 OK
                console.log('returned /account/update');
                return of(new HttpResponse(request));
            }


            // pass through any requests not handled above
            return next.handle(request);

        }))

        // call materialize and dematerialize to ensure delay even if an error is thrown
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize());
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
