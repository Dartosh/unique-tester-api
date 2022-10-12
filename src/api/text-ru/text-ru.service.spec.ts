import { Test, TestingModule } from '@nestjs/testing';
import { TextRuService } from './text-ru.service';

describe('TextRuService', () => {
  let service: TextRuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TextRuService],
    }).compile();

    service = module.get<TextRuService>(TextRuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
