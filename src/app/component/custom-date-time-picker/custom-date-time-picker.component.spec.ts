import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDateTimePickerComponent } from './custom-date-time-picker.component';

describe('CustomDateTimePickerComponent', () => {
  let component: CustomDateTimePickerComponent;
  let fixture: ComponentFixture<CustomDateTimePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomDateTimePickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomDateTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
