export interface TextRuFileInterface {
  text: string;

  userkey: string;

  exceptdomain?: string;

  excepturl?: string;

  visible?: string | 'vis_on';

  callback?: string;

  setExceptdomain(exceptdomain: string): TextRuFileInterface;

  setExcepturl(excepturl: string): TextRuFileInterface;

  setVisible(visible: string | 'vis_on'): TextRuFileInterface;
}
