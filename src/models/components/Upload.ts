export interface ISongFile {
  uid: string | undefined;
  displayName: string | null | undefined;
  originalName: string;
  modifiedName: string;
  genre: string;
  commentCount: number;
  url: null | Promise<unknown>
}

export interface IUploadFile {
  task: any;
  currentProgress: number;
  name: string;
  variant: string;
  icon: string;
  textClass: string;
}
