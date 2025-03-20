import republicDictItem from "@/utils/constants/republicDictItem";

import { LocationDictionary } from "@/types/general";

const returnModifieLocationDictionary = (lDictionary: LocationDictionary): LocationDictionary => {
  const modified: LocationDictionary = {
    ...lDictionary,
    districts: [...lDictionary.districts, republicDictItem]
  }

  return modified;
}

export default returnModifieLocationDictionary;
