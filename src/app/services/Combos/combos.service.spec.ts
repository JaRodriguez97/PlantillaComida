import { TestBed } from '@angular/core/testing';

import { CombosService } from './combos.service';

describe('CombosService', () => {
  let service: CombosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CombosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
