import { AccountDialogConfig } from './../../shared/models/dialog.config.model';
import { AccountEditModalComponent } from './../account-edit/account-edit-modal.component';
import { AccountsService } from './../../shared/services/accounts/accounts.service';
import { AccountItem } from './../../shared/models/account-item.model';
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AccountListComponent implements OnInit, OnDestroy {


  displayedColumns: string[] = ['fullname', 'DOB', 'actions'];
  dataSource: AccountItem[];
  confirm$: Observable<boolean>;
  dataLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  subs: Subscription[] = [];
  accountsServiceSub: Subscription;

  constructor(
    private accountsService: AccountsService,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.accountsServiceSub = this.accountsService.getData().subscribe(
      response => {
        this.dataSource = [...response];
        this.cdRef.markForCheck();
        this.dataLoading$.next(false);

      }
    );
    this.subs.push(this.accountsServiceSub);

    }

    editAccount(accountId) {
      this.accountsService.getDataById(accountId)
      .pipe(
        take(1)
      )
      .subscribe(acc => {
        this.openEditModal(acc);
      });

    }
    openEditModal(editAccount: AccountItem) {

      const dialogCF: AccountDialogConfig = {
        account: editAccount
      };

      const dialogRef = this.dialog.open(AccountEditModalComponent, { minWidth: '600px', data: dialogCF });
      this.confirm$ = dialogRef.afterClosed();

    }

    ngOnDestroy() {
      this.subs.forEach(s => s.unsubscribe());
    }

}
