import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotateurComponent } from './annotateur.component';

describe('AnnotateurComponent', () => {
  let component: AnnotateurComponent;
  let fixture: ComponentFixture<AnnotateurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnotateurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
