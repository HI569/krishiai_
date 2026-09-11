import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Disaster } from './disaster';

describe('Disaster', () => {
  let component: Disaster;
  let fixture: ComponentFixture<Disaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Disaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Disaster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
