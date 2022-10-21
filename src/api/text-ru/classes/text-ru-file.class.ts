import { TextRuFileInterface } from '../interfaces/text-ru-file.interface';

export class TextRuFile implements TextRuFileInterface {
  public text: string;

  public userkey: string;

  public exceptdomain?: string;

  public excepturl?: string;

  public visible?: string | 'vis_on';

  public callback?: string;

  constructor(text: string, userkey: string, callback: string) {
    this.text = text;
    this.userkey = userkey;
    this.callback = callback;
  }

  setExceptdomain(exceptdomain: string) {
    this.exceptdomain = exceptdomain;

    return this;
  }

  setExcepturl(excepturl: string) {
    this.excepturl = excepturl;

    return this;
  }

  setVisible(visible: string | 'vis_on') {
    this.visible = visible;

    return this;
  }
}
