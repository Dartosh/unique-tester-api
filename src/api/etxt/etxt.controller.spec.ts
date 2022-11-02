import { Test, TestingModule } from '@nestjs/testing';
import { EtxtController } from './etxt.controller';

describe('EtxtController', () => {
  let controller: EtxtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EtxtController],
    }).compile();

    controller = module.get<EtxtController>(EtxtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
