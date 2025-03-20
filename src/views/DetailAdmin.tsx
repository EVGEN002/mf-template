import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Download,
  ArrowLeft,
  Plus,
  Minus,
  Search,
  Layers,
  MapPinPlus,
  Pencil,
  ChevronDown,
  PencilIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Map from 'MapProvider/MapComponentContainer';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

import '@/assets/global.css';

import {
  getDictionary,
  getDictionaryFundsettings,
  getSpatialData,
  postSpatialData,
  putSpatialData
} from '@/api';

import {
  AttachedFile,
  Material,
  RepoFile,
  StoragedFile
} from '@/types/spatialData';
import BaseItem from '@/components/BaseItem';
import TextareaItem from '@/components/TextareaItem';
import BaseItemNumber from '@/components/BaseItemNumber';
import { toast } from 'react-toastify';
import { cn } from '@/lib/utils';
import BaseLabel from '@/components/BaseLabel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import SpatialImages from '@/modules/SpatialImages';
import returnRepoSrc from '@/helpers/returnRepoSrc';
import returnFileSrcFromPath from '@/helpers/returnFileSrcFromPath';

const defaultMaterial: Material = {
  name: '',
  mainGeoObjectName: '',
  shortName: '',
  barcode: null,
  inventarNumber: null,
  coordinateSystem: null,
  projection: '',
  formats: [],
  materialCreatorId: null,
  mapOwner: '',
  storageSection: '',
  scale: null,
  yearCreate: null,
  yearConformity: null,
  secretStatus: null,
  accessConditions: '',
  location: '',
  materialTypeId: null,
  baseType: null,
  status: null,
  displayForm: null,
  areaBySheetFrameSquareMeter: null,
  baseUnitOfAccount: null,
  numberOfUnits: null,
  imageType: '',
  resolution: '',
  accuracy: '',
  cloudiness: null,
  lat: null,
  lng: null,
  geometryString: '',
  wmsLayer: '',
  accuracySpatialData: '',
  inventarNumberOfPd: '',
  copyNumber: '',
  note: '',
  numberOfSheets: null,
  coordSystemId: null,
  locationGuids: '',
  editor: '',
  serializedAdditionalFields: ''
};

export default function DetailAdmin({ id }: { id: string }) {
  const [data, setData] = useState<Material | null>(null);
  const [material, setMaterial] = useState<Material>(defaultMaterial);
  const [baseDictionary, setBaseDictionary] = useState<{
    [key: string]: any[];
  }>({});
  const [isLoaded, setIsLoaded] = useState(false);

  const [expandedImage, setExpandedImage] = useState<
    RepoFile | AttachedFile | null
  >(null);

  const handleSetBaseDictionary = <T,>(
    promiseResult: PromiseSettledResult<T>,
    key: string,
    setter: React.Dispatch<React.SetStateAction<T>>
  ): T | null | undefined => {
    if (promiseResult.status === 'fulfilled') {
      const promiseData = promiseResult.value;

      setter((prev) => ({ ...prev, [key]: (promiseData as any).data }));

      return (promiseData as any).data;
    } else if (promiseResult.status === 'rejected') {
      console.error(promiseResult.reason);

      return null;
    }
  };

  useEffect(() => {
    (async () => {
      const response = await getSpatialData(id);

      if (response.success && response.data) {
        setMaterial(response.data);
      } else {
        throw new Error(response.error?.message);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const p_material = getSpatialData(id);
      const p_secretStatusTypes = getDictionary('secretStatusTypes');
      const p_materialOrderTypes = getDictionary('materialOrderTypes');
      const p_basetype = getDictionary('basetype');
      const p_purchase_method = getDictionary('purchase_method');
      const p_material_form = getDictionary('material_form');
      const p_paper_size = getDictionary('paper_size');
      const p_condition = getDictionary('condition');
      const p_expiration = getDictionary('expiration');
      const p_dayoffs = getDictionary('dayoffs');
      const p_appform_structure = getDictionary('appform_structure');
      const p_appform = getDictionary('appform');
      const p_materialcreator = getDictionary('materialcreator');
      const p_coordinateSystems = getDictionary('coordinateSystems');
      const p_displayforms = getDictionary('displayforms');
      const p_order_types = getDictionary('order_types');
      const p_order_status = getDictionary('order_status');
      const p_materialtypes = getDictionary('materialtypes');
      const p_location = getDictionary('location');
      const p_materialformats = getDictionary('materialformats');
      const p_ListOfRackValues = getDictionaryFundsettings('ListOfRackValues');
      const p_ListOfSectionValues = getDictionaryFundsettings(
        'ListOfSectionValues'
      );
      const p_ListOfShelfValues =
        getDictionaryFundsettings('ListOfShelfValues');
      const p_ListOfCellValues = getDictionaryFundsettings('ListOfCellValues');
      const p_materialbaseunits = getDictionary('materialbaseunits');

      const [
        r_material,
        r_secrectStatusTypes,
        r_materialOrderTypes,
        r_baseType,
        r_purchase_method,
        r_material_form,
        r_paper_size,
        r_condition,
        r_expiration,
        r_dayoffs,
        r_appform_structure,
        r_appform,
        r_materialcreator,
        r_coordinateSystems,
        r_displayforms,
        r_order_types,
        r_order_status,
        r_materialtypes,
        r_location,
        r_materialformats,
        r_ListOfRackValues,
        r_ListOfSectionValues,
        r_ListOfShelfValues,
        r_ListOfCellValues,
        r_materialbaseunits
      ] = await Promise.allSettled([
        p_material,
        p_secretStatusTypes,
        p_materialOrderTypes,
        p_basetype,
        p_purchase_method,
        p_material_form,
        p_paper_size,
        p_condition,
        p_expiration,
        p_dayoffs,
        p_appform_structure,
        p_appform,
        p_materialcreator,
        p_coordinateSystems,
        p_displayforms,
        p_order_types,
        p_order_status,
        p_materialtypes,
        p_location,
        p_materialformats,
        p_ListOfRackValues,
        p_ListOfSectionValues,
        p_ListOfShelfValues,
        p_ListOfCellValues,
        p_materialbaseunits
      ]);

      handleSetBaseDictionary<any>(
        r_secrectStatusTypes,
        'secretStatusTypes',
        setBaseDictionary
      );
      handleSetBaseDictionary<any>(
        r_materialOrderTypes,
        'materialOrderTypes',
        setBaseDictionary
      );
      handleSetBaseDictionary<any>(r_baseType, 'basetype', setBaseDictionary);
      handleSetBaseDictionary<any>(
        r_purchase_method,
        'purchase_method',
        setBaseDictionary
      );
      handleSetBaseDictionary<any>(
        r_material_form,
        'material_form',
        setBaseDictionary
      );
      handleSetBaseDictionary<any>(
        r_paper_size,
        'paper_size',
        setBaseDictionary
      );
      handleSetBaseDictionary<any>(r_condition, 'condition', setBaseDictionary);
      handleSetBaseDictionary<any>(
        r_expiration,
        'expiration',
        setBaseDictionary
      );
      handleSetBaseDictionary<any>(r_dayoffs, 'dayoffs', setBaseDictionary);
      handleSetBaseDictionary<any>(
        r_appform_structure,
        'appform_structure',
        setBaseDictionary
      );
      handleSetBaseDictionary<any>(r_appform, 'appform', setBaseDictionary);
      handleSetBaseDictionary<any>(
        r_materialcreator,
        'materialcreator',
        setBaseDictionary
      );
      handleSetBaseDictionary<any>(
        r_coordinateSystems,
        'coordinateSystems',
        setBaseDictionary
      );
      handleSetBaseDictionary<any>(
        r_displayforms,
        'displayforms',
        setBaseDictionary
      );
      handleSetBaseDictionary<any>(
        r_order_types,
        'order_types',
        setBaseDictionary
      );
      handleSetBaseDictionary<any>(
        r_order_status,
        'order_status',
        setBaseDictionary
      );
      handleSetBaseDictionary<any>(
        r_materialtypes,
        'materialtypes',
        setBaseDictionary
      );
      handleSetBaseDictionary<any>(r_location, 'location', setBaseDictionary);
      handleSetBaseDictionary<any>(
        r_materialformats,
        'materialformats',
        setBaseDictionary
      );
      handleSetBaseDictionary<any>(
        r_ListOfRackValues,
        'ListOfRackValues',
        setBaseDictionary
      );
      handleSetBaseDictionary<any>(
        r_ListOfSectionValues,
        'ListOfSectionValues',
        setBaseDictionary
      );
      handleSetBaseDictionary<any>(
        r_ListOfShelfValues,
        'ListOfCellValues',
        setBaseDictionary
      );
      handleSetBaseDictionary<any>(
        r_ListOfCellValues,
        'ListOfCellValues',
        setBaseDictionary
      );
      handleSetBaseDictionary<any>(
        r_materialbaseunits,
        'materialbaseunits',
        setBaseDictionary
      );
      if (r_material.status === 'fulfilled') {
        const data = r_material.value;

        setMaterial((data as any).data);
      }
      setIsLoaded(true);
    };

    fetchData();
  }, []);

  const set = (key: string, value: any) => {
    setMaterial((prev: any) => ({ ...prev, [key]: value }));
  };

  const editHref = () => {
    const MODE = process.env.MODE;
    let href: string;

    if (MODE === 'production') {
      href = `/material-edit/${id}`;
    } else if (MODE === 'local') {
      href = `/sakhagis/material-edit/${id}`;
    } else if (MODE === 'development') {
      href = `https://yakit.pro/sakhagis/material-edit/${id}`;
    } else {
      href = '';
    }

    return href;
  };

  const renderDoc = (file: RepoFile) => {
    const MODE = process.env.MODE;
    let link: string;

    if (MODE === 'production') {
      link = `/apimap/repo/${file.code}`;
    } else if (MODE === 'local') {
      link = `/sakhagis/apimap/repo/${file.code}`;
    } else if (MODE === 'development') {
      link = `https://yakit.pro/sakhagis/apimap/repo/${file.code}`;
    } else {
      link = '';
    }

    const name = file?.name ?? '';
    const ext = file?.ext ?? '';

    return <a href={link}>{name + ext}</a>;
  };

  const renderDocFromPath = (path: string | null, description: string) => {
    if (!path) return;
    const MODE = process.env.MODE;
    let src: string;
    const normalizedPath = path.replace(/\\/g, '/');

    if (MODE === 'production') {
      src = `/storage/${normalizedPath}`;
    } else if (MODE === 'local') {
      src = `/sakhagis/storage/${normalizedPath}`;
    } else if (MODE === 'development') {
      src = `https://yakit.pro/sakhagis/storage/${normalizedPath}`;
    } else {
      src = '';
    }

    return <a href={src}>{description}</a>;
  };

  return (
    <div className="h-full overflow-auto px-[30px]">
      <div className="grid h-full grid-cols-4 gap-6 py-6">
        <Card className="col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center">
              {isLoaded ? material?.name : <Skeleton className="h-6 w-full" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative flex-1 p-0">
            <div className="left-0 top-0 h-full w-full space-y-4 p-6 pt-0">
              {isLoaded && (
                <>
                  <TextareaItem
                    readOnly={true}
                    label="Наименование"
                    placeholder=""
                    value={material?.name ?? undefined}
                    onChange={(event) => set('name', event.target.value)}
                  />
                  <BaseLabel label="Вид пространственных данных">
                    <Select
                      value={
                        baseDictionary?.materialtypes?.find(
                          (item) => item?.id == material?.materialTypeId
                        )?.id
                      }
                      onValueChange={(value) =>
                        setMaterial((prev) => ({
                          ...prev,
                          materialTypeId: Number(value)
                        }))
                      }
                      disabled
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите вид пространственных данных" />
                      </SelectTrigger>
                      <SelectContent>
                        {baseDictionary.materialtypes?.map((item: any) => (
                          <SelectItem value={item?.id}>{item?.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </BaseLabel>
                  <BaseItem
                    readOnly={true}
                    label="Местонахождение территории"
                    value={material.location
                      ?.split(',')
                      .map((item) => item.trim())
                      .join(', ')}
                    onChange={(event) => {}}
                  />
                  <BaseItemNumber
                    readOnly={true}
                    label="Год создания*"
                    value={material?.yearCreate}
                    onChange={(event) => set('yearCreate', event.target.value)}
                  />
                  <BaseLabel label="Система координат">
                    <Select
                      disabled
                      value={
                        baseDictionary?.coordinateSystems?.find(
                          (item) => item?.id == material?.coordSystemId
                        )?.id
                      }
                      onValueChange={(value) =>
                        setMaterial((prev) => ({
                          ...prev,
                          coordSystemId: Number(value) ?? null
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите систему координат" />
                      </SelectTrigger>
                      <SelectContent>
                        {baseDictionary.coordinateSystems?.map((item: any) => (
                          <SelectItem value={item?.id}>{item?.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </BaseLabel>
                  <BaseItemNumber
                    readOnly={true}
                    label="Масштаб"
                    value={material?.scale}
                    onChange={(event) => set('scale', event.target.value)}
                  />
                  {/* Форма хранения данных */}
                  <BaseLabel label="Секретность">
                    <Select
                      disabled
                      value={
                        baseDictionary?.secretStatusTypes?.find(
                          (item) => item?.id == material?.secretStatus
                        )?.id
                      }
                      onValueChange={(value) =>
                        setMaterial((prev) => ({
                          ...prev,
                          secretStatus: Number(value) ?? null
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите секретность" />
                      </SelectTrigger>
                      <SelectContent>
                        {baseDictionary.secretStatusTypes?.map((item: any) => (
                          <SelectItem value={item?.id}>{item?.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </BaseLabel>
                  <BaseLabel label="Организация-изготовитель">
                    <Select
                      disabled
                      value={
                        baseDictionary?.materialcreator?.find(
                          (item) => item?.id == material?.materialCreatorId
                        )?.id
                      }
                      onValueChange={(value) =>
                        setMaterial((prev) => ({
                          ...prev,
                          materialCreatorId: Number(value)
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите организацию" />
                      </SelectTrigger>
                      <SelectContent>
                        {baseDictionary.materialcreator?.map((item: any) => (
                          <SelectItem value={item?.id}>{item?.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </BaseLabel>
                  <BaseItem
                    readOnly={true}
                    label="Правообладатель"
                    value={material?.mapOwner}
                    onChange={(event) => set('projection', event.target.value)}
                  />
                  <BaseItemNumber
                    readOnly={true}
                    label="Год соответствия местности*"
                    value={material?.yearConformity}
                    onChange={(event) =>
                      set('yearConformity', event.target.value)
                    }
                  />
                  <BaseItem
                    readOnly={true}
                    label="Условия доступа"
                    value={material?.accessConditions}
                    onChange={(event) =>
                      set('accessConditions', event.target.value)
                    }
                  />
                  <BaseItem
                    readOnly={true}
                    label="Главный географический объект"
                    value={material?.mainGeoObjectName}
                    onChange={(event) =>
                      set('mainGeoObjectName', event.target.value)
                    }
                  />
                  <BaseItem
                    readOnly={true}
                    label="Короткое наименование"
                    value={material?.shortName}
                    onChange={(event) => set('shortName', event.target.value)}
                  />
                  <BaseItem
                    readOnly={true}
                    label="Штрихкод"
                    value={String(material?.barcode)}
                    onChange={(event) => {}}
                  />
                  <BaseItem
                    readOnly={true}
                    label="Инвентарный номер"
                    value={material?.inventarNumber}
                    onChange={(event) => {}}
                  />
                  <BaseItem
                    readOnly={true}
                    label="Идентификатор"
                    value={id}
                    onChange={(event) => {}}
                  />
                  <BaseItem
                    readOnly={true}
                    label="Проекция"
                    value={material?.projection}
                    onChange={(event) => set('projection', event.target.value)}
                  />
                  <BaseItem
                    readOnly={true}
                    label="Раздел хранения"
                    value={material?.storageSection}
                    onChange={(event) => {}}
                  />
                  <BaseLabel label="Базовый тип*">
                    <Select
                      disabled
                      value={
                        baseDictionary?.basetype?.find(
                          (item) => item?.id == material?.baseType
                        )?.id
                      }
                      onValueChange={(value) =>
                        setMaterial((prev) => ({
                          ...prev,
                          baseType: Number(value)
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите базовый тип" />
                      </SelectTrigger>
                      <SelectContent>
                        {baseDictionary.basetype?.map((item: any) => (
                          <SelectItem value={item?.id}>{item?.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </BaseLabel>
                  <BaseItemNumber
                    readOnly={true}
                    label="Просмотров"
                    value={material?.views ?? undefined}
                    onChange={(event) => {}}
                  />
                  <BaseItemNumber
                    readOnly={true}
                    label="Загрузок"
                    value={material?.downloads ?? undefined}
                    onChange={(event) => {}}
                  />
                  <BaseLabel label="Форма предоставления данных*">
                    <Select
                      disabled
                      value={
                        baseDictionary?.displayforms?.find(
                          (item) => item?.id == material?.displayForm
                        )?.id
                      }
                      onValueChange={(value) =>
                        setMaterial((prev) => ({
                          ...prev,
                          displayForm: Number(value)
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        {baseDictionary.displayforms?.map((item: any) => (
                          <SelectItem value={item?.id}>{item?.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </BaseLabel>
                  <BaseItemNumber
                    readOnly={true}
                    label="Площадь по рамке листа, кв.м."
                    value={material?.areaBySheetFrameSquareMeter}
                    onChange={(event) =>
                      set('areaBySheetFrameSquareMeter', event.target.value)
                    }
                  />
                  <BaseItemNumber
                    readOnly={true}
                    label="Площадь в масштабе создания, кв. дм."
                    value={material?.areaByCreateScaleSquareDecimeters}
                    onChange={(event) => {}}
                  />
                  <BaseLabel label="Базовая расчетная единица*">
                    <Select
                      disabled
                      value={
                        baseDictionary?.materialbaseunits?.find(
                          (item) => item?.id == material?.baseUnitOfAccount
                        )?.id
                      }
                      onValueChange={(value) =>
                        setMaterial((prev) => ({
                          ...prev,
                          baseUnitOfAccount: Number(value)
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите базовую расчетную единицу" />
                      </SelectTrigger>
                      <SelectContent>
                        {baseDictionary.materialbaseunits?.map((item: any) => (
                          <SelectItem value={item?.id}>{item?.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </BaseLabel>
                  <BaseItemNumber
                    readOnly={true}
                    label="Количество листов карты"
                    value={material?.numberOfSheets}
                    onChange={(event) =>
                      set('numberOfSheets', event.target.value)
                    }
                  />
                  <BaseItemNumber
                    readOnly={true}
                    label="Количество кадров"
                    value={material?.numberOfUnits}
                    onChange={(event) =>
                      set('numberOfUnits', event.target.value)
                    }
                  />
                  <BaseItemNumber
                    readOnly={true}
                    label="Стоимость пространственных данных. руб"
                    value={material?.cost}
                    onChange={(event) => {}}
                  />
                  <BaseLabel label="Статус">
                    <Select
                      disabled
                      value={String(material.status)}
                      onValueChange={(value) =>
                        setMaterial((prev) => ({
                          ...prev,
                          status: Number(value)
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите статус" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Черновик</SelectItem>
                        <SelectItem value="1">Опубликовано</SelectItem>
                      </SelectContent>
                    </Select>
                  </BaseLabel>
                  <TextareaItem
                    readOnly={true}
                    label="Контур простр. данных в формате GeoJSON"
                    placeholder="Вставьте контур простр. данных в формате GeoJSON"
                    value={material?.geometryString ?? undefined}
                    onChange={(event) =>
                      set('geometryString', event.target.value)
                    }
                  />
                  <BaseLabel label="Формат хранения">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          disabled
                          className="flex h-10 w-full items-center justify-between px-3 py-2 font-normal text-muted-foreground"
                          variant="outline"
                        >
                          <span className="max-w-[90%] overflow-hidden text-ellipsis">
                            {(material?.formats)!.length > 0
                              ? material?.formats!.join(', ')
                              : 'Выбрать нужные форматы'}
                          </span>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="max-h-[250px] min-w-52 overflow-y-auto"
                        align="start"
                      >
                        {baseDictionary.materialformats?.map(
                          (item: string, index: number) => {
                            return (
                              <DropdownMenuCheckboxItem
                                checked={material?.formats?.includes(item)}
                                onCheckedChange={(value) => {
                                  setMaterial((prev) => ({
                                    ...prev,
                                    formats: prev.formats
                                      ? [...prev.formats, item]
                                      : null
                                  }));
                                }}
                              >
                                {item}
                              </DropdownMenuCheckboxItem>
                            );
                          }
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </BaseLabel>
                  <BaseItem
                    readOnly={true}
                    label="WMS-слой"
                    value={material?.wmsLayer}
                    onChange={(event) => set('wmsLayer', event.target.value)}
                  />
                  <BaseItem
                    readOnly={true}
                    label="Вид изображения"
                    value={material?.imageType}
                    onChange={(event) => set('imageType', event.target.value)}
                  />
                  <BaseItem
                    readOnly={true}
                    label="Разрешение"
                    value={material?.resolution}
                    onChange={(event) => set('resolution', event.target.value)}
                  />
                  <BaseItem
                    readOnly={true}
                    label="Точность"
                    value={material?.accuracy}
                    onChange={(event) => set('accuracy', event.target.value)}
                  />
                  <BaseItemNumber
                    readOnly={true}
                    label="Облачность. %"
                    value={material?.cloudiness}
                    onChange={(event) => set('cloudiness', event.target.value)}
                  />
                  <BaseItemNumber
                    readOnly={true}
                    label="Широта*"
                    value={material?.lat}
                    onChange={(event) => set('lat', event.target.value)}
                  />
                  <BaseItemNumber
                    readOnly={true}
                    label="Долгота*"
                    value={material?.lng}
                    onChange={(event) => set('lng', event.target.value)}
                  />
                  <BaseItem
                    readOnly={true}
                    label="Дата создания"
                    value={
                      material?.createDate
                        ? new Date(material?.createDate).toLocaleDateString(
                            'ru-RU'
                          )
                        : ''
                    }
                    onChange={(event) => {}}
                  />
                  <BaseItem
                    readOnly={true}
                    label="Дата редактирования"
                    value={
                      material?.modifiedDate
                        ? new Date(material?.modifiedDate).toLocaleDateString(
                            'ru-RU'
                          )
                        : ''
                    }
                    onChange={(event) => {}}
                  />
                  <BaseItem
                    readOnly={true}
                    label="Редактор"
                    value={material?.editor}
                    onChange={(event) => {}}
                  />
                </>
              )}
              {!isLoaded && (
                <>
                  {new Array(25).fill(null).map((_, index) => (
                    <div key={index}>
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="col-span-2 space-y-4">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Контур пространственных данных</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video overflow-hidden rounded-lg bg-gray-200">
                <Map
                  type="spatial-data"
                  geometry={material?.geometryString ?? ''}
                />
              </div>
            </CardContent>
          </Card>

          {/* <Card className="col-span-3">
            <CardHeader>
              <CardTitle>
                Изображения предпросмотра пространственных данных
              </CardTitle>
            </CardHeader>
            <CardContent>
              {material?.repoFiles?.repoAttachedFiles &&
              material?.repoFiles?.repoAttachedFiles?.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {material?.repoFiles.repoAttachedFiles.map((file) => (
                    <div
                      className="relative h-[150px] w-[150px] cursor-pointer overflow-hidden rounded transition-shadow hover:shadow-lg"
                      onClick={() => setExpandedImage(file)}
                    >
                      <img
                        src={`${returnRepoSrc(file?.code)}`}
                        alt={file.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : material?.attachedFilesList &&
                material?.attachedFilesList?.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {material?.attachedFilesList.map((file) => (
                    <img
                      src={`${returnFileSrcFromPath(file?.path)}`}
                      alt="Preview 1"
                      className="h-auto w-[400px] rounded-lg"
                      width={400}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  Нет доступных файлов
                </div>
              )}
            </CardContent>
          </Card> */}
          <SpatialImages
            repoAttachedFiles={material?.repoFiles?.repoAttachedFiles}
            attachedFilesList={material?.attachedFilesList}
            onClickImage={(file) => setExpandedImage(file)}
          />

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Файлы пространственных данных</CardTitle>
            </CardHeader>
            <CardContent>
              {material?.repoFiles?.repoStorageFiles &&
              material?.repoFiles.repoStorageFiles.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {material?.repoFiles.repoStorageFiles.map((file) => (
                    <div className="flex items-center gap-2">
                      {renderDoc(file)}
                    </div>
                  ))}
                </div>
              ) : material?.storageFilesList &&
                material?.storageFilesList?.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {material?.storageFilesList.map((file: any) =>
                    renderDocFromPath(file.path, file.description)
                  )}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  Нет доступных файлов
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="col-span-4 flex justify-between pb-[30px]">
          <Button variant="outline" onClick={() => history.back()}>
            <ArrowLeft className="mr-2" size={16} />
            Назад к каталогу
          </Button>
          <a href={editHref()}>
            <Button>
              <PencilIcon className="mr-2" /> Редактировать
            </Button>
          </a>
        </div>
      </div>
      <Dialog
        open={!!expandedImage}
        onOpenChange={(open) => {
          if (open === false) {
            setExpandedImage(null);
          }
        }}
      >
        <DialogContent className="flex max-h-[90vh] max-w-[90vw] items-center justify-center">
          {expandedImage && (
            <img
              src={
                'code' in expandedImage
                  ? returnRepoSrc(expandedImage.code) // для RepoFile
                  : returnFileSrcFromPath(expandedImage.path) // для AttachedFile
              }
              alt="expanede image"
              className="h-full w-auto object-cover"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
