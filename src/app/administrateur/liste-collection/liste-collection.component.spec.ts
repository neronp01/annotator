import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeCollectionComponent } from './liste-collection.component';

describe('ListeCollectionComponent', () => {
  let component: ListeCollectionComponent;
  let fixture: ComponentFixture<ListeCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
