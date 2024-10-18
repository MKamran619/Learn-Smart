import { TestBed } from '@angular/core/testing';

import { SpeechDetectService } from './speech-detect.service';

describe('SpeechDetectService', () => {
  let service: SpeechDetectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeechDetectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
