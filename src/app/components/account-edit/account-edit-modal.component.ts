import { catchError } from 'rxjs/operators';
import { AccountsService } from './../../shared/services/accounts/accounts.service';
import { AccountDialogConfig } from './../../shared/models/dialog.config.model';
import { Component, ChangeDetectionStrategy, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

@Component({
  selector: 'app-account-edit-modal',
  templateUrl: './account-edit-modal.component.html',
  styleUrls: ['./account-edit-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountEditModalComponent implements OnInit {

  public form: FormGroup;
  public initials;
  public updatedDOBisValid;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AccountDialogConfig,
    private accountsService: AccountsService,
    public dialogRef: MatDialogRef<AccountEditModalComponent>,
    private fb: FormBuilder
    ) { }

    ngOnInit() {

      this.form = this.fb.group({
        fullname: this.fb.control(this.data.account.fullname, Validators.required),
        dob: this.fb.control(this.data.account.dob, Validators.required),

      });

      const splitName = this.data.account.fullname.split(' ');
      this.initials = `${splitName[0].charAt(0)}${splitName[1].charAt(0)}`;

    }
    updatedDobValue($event) {
      this.form.get('dob').setValue($event.value);
      this.updatedDOBisValid = $event.valid;
    }

    cancel() {
      this.closeDialog(false);
    }
    saveChanges() {

      const sendData = {
        id: this.data.account.id,
        fullname: this.form.value.fullname,
        dob: this.form.value.dob
      };


      this.accountsService.updateAccount(sendData)
      .pipe(
        catchError(this.handleError)
      )
      .subscribe(response => {
        console.log('response', response);
        if (!!response) {
          this.closeDialog(true);
        } else {
          this.handleError(response);
        }
      });
      }

      handleError(err) {
        return of(false);
      }

      closeDialog(ok) {
        this.dialogRef.close(ok);
      }

    }

