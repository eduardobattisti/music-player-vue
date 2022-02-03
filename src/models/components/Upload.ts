export interface IFile {
  lastModified: number;
  lastModifiedDate: string;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}

// export interface IUploadEvent {
//   dataTransfer: {
//     files: string;
//   };
//   target: {
//     files: Array<IFile>;
//   };
// }

export interface IUploadEvent extends DragEvent, InputEvent { }
