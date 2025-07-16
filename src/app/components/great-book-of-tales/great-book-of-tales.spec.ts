import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreatBookOfTales } from './great-book-of-tales';

describe('GreatBookOfTales', () => {
  let component: GreatBookOfTales;
  let fixture: ComponentFixture<GreatBookOfTales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GreatBookOfTales]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GreatBookOfTales);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
