import { Test, TestingModule } from '@nestjs/testing';
import { CutOffController } from './cut-off.controller';

describe('CutOffController', () => {
  let controller: CutOffController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CutOffController],
    }).compile();

    controller = module.get<CutOffController>(CutOffController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
