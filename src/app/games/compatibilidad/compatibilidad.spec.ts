import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Compatibilidad } from './compatibilidad';

describe('Compatibilidad', () => {
  let component: Compatibilidad;
  let fixture: ComponentFixture<Compatibilidad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Compatibilidad],
    }).compileComponents();

    fixture = TestBed.createComponent(Compatibilidad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
