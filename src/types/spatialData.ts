export interface AttachedFile {
  attachedfileid: string | null;
  name: string | null;
  description: string | null;
  path: string | null;
  size: number | null;
  userid: string | null;
  uploadtime: string | null;
  uploaderName: string | null;
  "uuid"?: string;
}

export interface StoragedFile {
  storagedfileid: string | null;
  name: string | null;
  description: string | null;
  path: string | null;
  size: number | null;
  userid: string | null;
  uploadtime: string | null;
  uploaderName: string | null;
  "uuid"?: string;
}

export interface RepoFile {
  "code": string,
  "obj": string,
  "obj_code": string,
  "obj_field": string,
  "title": string,
  "name": string,
  "ext": string,
  "size": number,
  "ord": number,
  "tip": string,
  "parent_code": null,
  "login_created": string,
  "date_created": Date,
  "is_deleted": boolean,
  "date_deleted": Date,
  "login_deleted": string,
  "user_id_created": number,
  "user_id_deleted": number,
  uuid?: string
}

export interface RepoFiles {
  repoAttachedFiles: RepoFile[],
  repoStorageFiles: RepoFile[]
}

export interface Material {
  name: string | null;
  mainGeoObjectName: string | null;
  shortName: string | null;
  barcode: number | null;
  inventarNumber: string | null;
  coordinateSystem: number | null;
  projection: string | null;
  formats: string[] | null;
  materialCreatorId: number | null;
  mapOwner: string | null;
  storageSection: string | null;
  scale: number | null;
  yearCreate: number | null;
  yearConformity: number | null;
  secretStatus: number | null;
  accessConditions: string | null;
  location: string | null;
  materialTypeId: number | null;
  baseType: number | null;
  status: number | null;
  displayForm: number | null;
  areaBySheetFrameSquareMeter: number | null;
  areaByCreateScaleSquareDecimeters?: number | null;
  baseUnitOfAccount: number | null;
  numberOfUnits: number | null;
  imageType: string | null;
  resolution: string | null;
  accuracy: string | null;
  cloudiness: number | null;
  lat: number | null;
  lng: number | null;
  geometryString: string | null;
  geometry?: any;
  wmsLayer: string | null;
  accuracySpatialData: string | null;
  inventarNumberOfPd: string | null;
  copyNumber: string | null;
  note: string | null;
  numberOfSheets: number | null;
  coordSystemId: number | null;
  locationGuids: string | null;
  editor: string | null;
  serializedAdditionalFields: string | null;
  views?: number | null;
  downloads?: number | null;
  attachedFilesList?: AttachedFile[];
  storageFilesList?: StoragedFile[];
  cost?: number | null;
  createDate?: Date | null;
  modifiedDate?: Date | null;
  guid?: string | null;
  repoFiles?: RepoFiles
}
