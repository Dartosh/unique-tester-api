export interface TextRuFileInterface {
    text: string;
    userkey: string;
    exceptdomain?: string;
    excepturl?: string;
    visible?: string | 'vis_on';
    callback?: string;
}
