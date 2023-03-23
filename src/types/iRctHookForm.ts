export interface IWiki {
  errors?: {
    id: {
      message: string;
    };
  };
  title: string;
  content: string;
  id: number;
}

export interface IWikiObjArr extends Array<IWiki> {}
