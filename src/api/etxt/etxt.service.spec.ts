import { Test, TestingModule } from '@nestjs/testing';
import { EtxtService } from './etxt.service';

describe('EtxtService', () => {
  let service: EtxtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EtxtService],
    }).compile();

    service = module.get<EtxtService>(EtxtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
