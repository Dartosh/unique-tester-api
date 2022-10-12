import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/modules/db';
import { TextRuFileResultDto } from './dto/text-ru-file-result.dto';
import { TextRuFileInterface } from './interfaces/text-ru-file.interface';
export declare class TextRuService {
    private readonly db;
    private readonly httpService;
    constructor(db: PrismaService, httpService: HttpService);
    private readonly UPLOAD_FILE_URL;
    private makeFileFormData;
    uploadFiles(files: TextRuFileInterface[]): Promise<void>;
    saveFilesResults(props: TextRuFileResultDto): Promise<void>;
}
