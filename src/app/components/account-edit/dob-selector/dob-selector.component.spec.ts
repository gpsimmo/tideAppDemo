import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DobSelectorComponent } from './dob-selector.component';

describe('DobSelectorComponent', () => {
  let component: DobSelectorComponent;
  let fixture: ComponentFixture<DobSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DobSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DobSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
