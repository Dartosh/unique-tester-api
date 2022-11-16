type FtextType = {
  _: string;
  $: {
    uniq: string;
    format: string;
  };
};

type UrlType = {
  _: string;
  $: {
    unique: string;
    color: string;
  };
};

type UrlsType = {
  url: UrlType[];
};

type SettingsType = {
  SampleDimension: string[];

  NumSamples: string[];

  NumRefPerSample: string[];

  NumSamplesPerDocument: string[];

  CompareMethod: string[];

  CompareMethodUniq: string[];

  NumWordsInShingle: string[];

  IgnoreCitation: string[];

  UniquenessThreshold: string[];

  SelfUniq: string[];

  ShowAdvancedLogging: string[];
};

type StatisticType = {
  download_ratio: string[];

  total_pages: string[];

  capthas_from_yandex: string[];

  capthas_from_google: string[];

  capthas_from_nigma: string[];
};

export type EntryType = {
  id: string;

  type: string;

  name: string;

  ftext: FtextType[];

  urls: UrlsType[];

  num_substitutions: string[];

  statistics: StatisticType[];

  includes: string[];

  exceptions: string[];

  settings: SettingsType[];
};

type EtxtRootType = {
  numPacketsInQueue: string[];

  checkScope: string[];

  entry: EntryType[];
};

export interface ETxtResultsObjectType {
  root: EtxtRootType;
}
