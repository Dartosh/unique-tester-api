import { TextRuFileResultDto } from './dto/text-ru-file-result.dto';
import { TextRuFileInterface } from './interfaces/text-ru-file.interface';
import { TextRuService } from './text-ru.service';
export declare class TextRuController {
    private readonly textRuService;
    constructor(textRuService: TextRuService);
    uploadFiles(props: TextRuFileInterface): Promise<void>;
    saveFilesResults(props: TextRuFileResultDto): Promise<void>;
}
