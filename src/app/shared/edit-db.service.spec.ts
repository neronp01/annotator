import { TestBed, inject } from '@angular/core/testing';

import { EditDbService } from './edit-db.service';

describe('EditDbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditDbService]
    });
  });

  it('should be created', inject([EditDbService], (service: EditDbService) => {
    expect(service).toBeTruthy();
  }));
});
