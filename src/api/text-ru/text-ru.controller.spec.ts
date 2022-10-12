import { Test, TestingModule } from '@nestjs/testing';
import { TextRuController } from './text-ru.controller';

describe('TextRuController', () => {
  let controller: TextRuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TextRuController],
    }).compile();

    controller = module.get<TextRuController>(TextRuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
