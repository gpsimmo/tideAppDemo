import { AccountItem } from './../../models/account-item.model';
import { Injectable } from '@angular/core';
import {  Observable, BehaviorSubject } from 'rxjs';
import {  map, take, tap } from 'rxjs/operators';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  constructor(private http: HttpClient) { }

  myData: BehaviorSubject<AccountItem[]> = new BehaviorSubject([]);

  getData(): Observable<AccountItem[]> {
    // return Observable from cached myDate subject
    // fetch data from api if cached is empty
    if (!this.myData.getValue().length ) {
        this.fetchData();
    }
    return this.myData.asObservable();

  }
  fetchData(): void {

    this.http.get<AccountItem[]>(`/accounts`).pipe(
      take(1)
    )
    .subscribe(res => {
      this.myData.next(res);
    });

  }

  getDataById(id): Observable<AccountItem> {
    return this.myData.pipe(
      map( (accountData: AccountItem[]) => accountData.find(account => account.id === id) )
    );

  }

  updateAccount(body, options?) {
    return this.http.post<AccountItem>(`/account/update`, body, options).pipe(
      tap((response: HttpResponse<AccountItem>) => {
        const currAccountData: any = this.myData.getValue();
        const itemIndex = currAccountData.findIndex(item => item.id === body.id);
        currAccountData[itemIndex] = response;
        this.myData.next(currAccountData);
      })
    );
  }

}
