import { v4 as uuidv4 } from 'uuid';

import { Material } from "@/types/spatialData";

const returnModifiedMaterialData = (material: Material): Material => {
  const modified = {
    ...material,
    repoFiles: {
      repoAttachedFiles:
        material.repoFiles?.repoAttachedFiles?.map((item) => ({
          ...item,
          uuid: uuidv4()
        })) || [],
      repoStorageFiles:
        material.repoFiles?.repoStorageFiles?.map((item) => ({
          ...item,
          uuid: uuidv4()
        })) || []
    },
    location: material.location
      ? material.location
        .split(',')
        .map((item) => item.trim())
        .join(',')
      : material.location
  }

  return modified;
}

export default returnModifiedMaterialData;
