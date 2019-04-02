import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-dob-selector',
  templateUrl: './dob-selector.component.html',
  styleUrls: ['./dob-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DobSelectorComponent implements OnInit, OnChanges {

  @Input() DOB: string;
  @Output() dobUpdated: EventEmitter<any> = new EventEmitter();

  days: number[] = [];
  isValidDOB = false;

  months = [
    {id: 1, name: 'January', days: 31},
    {id: 2, name: 'February', days: 28},
    {id: 3, name: 'March', days: 31},
    {id: 4, name: 'April', days: 30},
    {id: 5, name: 'May', days: 31},
    {id: 6, name: 'June', days: 30},
    {id: 7, name: 'July', days: 31},
    {id: 8, name: 'August', days: 31},
    {id: 9, name: 'September', days: 30},
    {id: 10, name: 'October', days: 31},
    {id: 11, name: 'November', days: 30},
    {id: 12, name: 'December', days: 31}
  ];

  years: number[] = [];

  private accountDOB;
  public dobForm: FormGroup;
  public dayControl: AbstractControl;
  public monthControl: AbstractControl;
  public yearControl: AbstractControl;


  constructor( private fb: FormBuilder) { }

  ngOnInit() {

    // build days list
    let i = 1;
    while (i <= 31) {

      this.days.push(
        i
      );
      i++;
    }

    // build years list
    const currYear  = new Date().getFullYear();
    let y = 1900;
    while (y <= (currYear)) {
      this.years.push(
       y
      );
      y++;
    }

   // Build abstracted form controls
    this.dobForm = this.fb.group({
      Day: ['', Validators.required],
      Month: ['', Validators.required],
      Year: ['', Validators.required],
      DOB: ['']
    }
    );

    this.dayControl = this.dobForm.controls.Day;
    this.monthControl = this.dobForm.controls.Month;
    this.yearControl = this.dobForm.controls.Year;

    this.updateForm();


  }


ngOnChanges(changes: SimpleChanges): void {
  // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
 if (changes.DOB && !!changes.DOB.currentValue) {
  this.accountDOB = changes.DOB.currentValue;
  }

}

updateForm() {
  // populate form controls
  this.dayControl.setValue(Number(this.accountDOB.split('/')[0]));
  this.monthControl.setValue(Number(this.accountDOB.split('/')[1]));
  this.yearControl.setValue(Number(this.accountDOB.split('/')[2]));

  this.selectorValueChanged();
}


selectorValueChanged($event?, type?) {
  // update control values
  if (!!type) {
    if (type === 'd') {
      this.dayControl.setValue($event);
    }
    if (type === 'm') {
      this.monthControl.setValue($event);
    }
    if (type === 'y') {
      this.yearControl.setValue($event);
    }
  }

  // trigger dov validation checker
  this.isValidDOB = this.checkValidateDOB(this.dayControl.value, this.monthControl.value, this.yearControl.value, this.months);

  // highlight form control to show valid or not
  this.dobForm.controls.DOB.setErrors({notValid: !this.isValidDOB} );

  // tell parent that date is update and valid status
  const data = {
    value: `${this.dayControl.value}/${this.monthControl.value}/${this.yearControl.value}`,
    valid: this.isValidDOB
  };
  this.dobUpdated.emit(data);
}

checkValidateDOB(daySelected, monthSelected, yearSelected, monthList) {
  const isLeap = (year) => ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
  let valid = true;
  if (!yearSelected || !monthSelected || !daySelected) {
    return false;
  }

  if (!!monthSelected && !!daySelected ) {
    // if day > month x.days - fail
    if (daySelected > monthList[monthSelected - 1].days) {
      valid = false;
    }

    // if leap year, month =1, then less than or eqaul 29  - valid
    if (!!Boolean(isLeap(yearSelected)) &&  (Number(monthSelected) === 2) && (Number(daySelected) <= 29) ) {
      valid = true;
    }

  }

  return valid;
}


}
