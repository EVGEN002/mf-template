export interface UploadResponse {
  code: string;
  date_created: string;
  ext: string;
  login_created: string;
  name: string;
  obj: string;
  obj_code: string;
  size: number;
  tip: string
  title: string;
};

export interface DistrictLocation {
  guid: string;
  id: string;
  name: string;
  fullName: string;
  disabled?: boolean;
}

export interface NaslegLocation {
  districtID: number;
  guid: string;
  id: number;
  name: string;
}

export interface TownLocation {
  guid: string;
  id: number;
  name: string;
  naslegID: number;
  districtID: number;
}

export interface LocationDictionary {
  districts: DistrictLocation[];
  naslegs: NaslegLocation[];
  towns: TownLocation[];
}

export interface CurrentUser {
  role: string;
  name: string;
}
