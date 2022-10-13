import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { PrismaService } from 'src/modules/db';
import { SpreadSheetDataDto } from '../google/dto/spreadsheet-data.dto';
import { TextRuFileResultDto } from './dto/text-ru-file-result.dto';
import { TextRuFileUidResponseInterface } from './interfaces/responses/text-ru-file-uid-res.interface';
import { TextRuFileInterface } from './interfaces/text-ru-file.interface';

@Injectable()
export class TextRuService {
  constructor(
    private readonly db: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  private readonly UPLOAD_FILE_URL = 'http://api.text.ru/post';

  // private getFileProperty<TextRuFileInterface>(
  //   name: keyof TextRuFileInterface,
  // ): string {
  //   return String(name);
  // }

  public async uploadFilesTextRu(props: SpreadSheetDataDto) {
    
  }

  private makeFileFormData(file: TextRuFileInterface): FormData {
    const fileKeys = Object.keys(file);

    const bodyFormData = new FormData();

    fileKeys.forEach((fileKey) => {
      bodyFormData.append(fileKey, file[fileKey]);
    });

    return bodyFormData;
  }

  public async uploadFiles(files: TextRuFileInterface[]): Promise<void> {
    const filePromises = files.map((file) => {
      const bodyFormData = this.makeFileFormData(file);

      return this.httpService.post(this.UPLOAD_FILE_URL, bodyFormData);
    });

    try {
      await Promise.allSettled(
        filePromises.map(async (filePromise) => {
          const filePromiseResult = await lastValueFrom(filePromise);

          const fileInfo: TextRuFileUidResponseInterface =
            filePromiseResult.data;

          await this.db.textRuTexts.create({
            data: {
              uid: fileInfo.text_uid,
            },
          });
        }),
      );
    } catch (error) {
      console.log('TextRuIploadFilesError: ', error);

      throw new BadRequestException(
        'Произошла ошибка при загрузке файлов на Text.ru.',
      );
    }
  }

  public async saveFilesResults(props: TextRuFileResultDto): Promise<void> {
    try {
      await this.db.textRuTexts.update({
        where: {
          uid: props.uid,
        },
        data: {
          textUnique: props.text_unique,
          // spellCheck: JSON.stringify(props.spell_check.replace('\\', '')),
          // jsonResult: JSON.stringify(props.json_result.replace('\\', '')),
        },
      });
    } catch (error) {
      console.log('TextRuSaveResultsError: ', error);

      throw new BadRequestException(
        'Произошла ошибка при получении результата проверки текста',
      );
    }
  }
}
