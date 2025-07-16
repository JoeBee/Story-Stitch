import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaysTale } from './todays-tale';

describe('TodaysTale', () => {
  let component: TodaysTale;
  let fixture: ComponentFixture<TodaysTale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodaysTale]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodaysTale);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
