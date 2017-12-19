import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDbComponent } from './list-db.component';

describe('ListDbComponent', () => {
  let component: ListDbComponent;
  let fixture: ComponentFixture<ListDbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
