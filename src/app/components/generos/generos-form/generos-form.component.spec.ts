import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerosFormComponent } from './generos-form.component';

describe('GenerosFormComponent', () => {
  let component: GenerosFormComponent;
  let fixture: ComponentFixture<GenerosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerosFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenerosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
