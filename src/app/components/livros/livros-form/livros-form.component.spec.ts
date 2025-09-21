import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivrosFormComponent } from './livros-form.component';

describe('LivrosFormComponent', () => {
  let component: LivrosFormComponent;
  let fixture: ComponentFixture<LivrosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivrosFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LivrosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
