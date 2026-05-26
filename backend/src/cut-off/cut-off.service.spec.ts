import { Test, TestingModule } from '@nestjs/testing';
import { CutOffService } from './cut-off.service';

describe('CutOffService', () => {
  let service: CutOffService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CutOffService],
    }).compile();

    service = module.get<CutOffService>(CutOffService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
