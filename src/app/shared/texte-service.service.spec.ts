import { TestBed, inject } from '@angular/core/testing';

import { TexteServiceService } from './texte-service.service';

describe('TexteServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TexteServiceService]
    });
  });

  it('should be created', inject([TexteServiceService], (service: TexteServiceService) => {
    expect(service).toBeTruthy();
  }));
});
