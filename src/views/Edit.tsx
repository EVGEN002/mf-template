import React, { useEffect, useState } from 'react';
import { ArrowLeft, Pencil, ChevronDown, LoaderCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Map from 'MapProvider/MapComponentContainer';

import '@/assets/global.css';

import {
  getDictionary,
  getDictionaryFundsettings,
  getSpatialData,
  postSpatialData,
  putSpatialData,
  uploadRepoFile
} from '@/api';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

import { Material, RepoFile } from '@/types/spatialData';
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

import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

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

interface SectionDictionary {
  cellValues: string[];
  rackValues: string[];
  sectionValues: string[];
  shelfValues: string[];
}

export interface DistrictLocation {
  guid: string;
  id: number;
  name: string;
  fullName: string;
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
}

export interface LocationDictionary {
  districts: DistrictLocation[];
  naslegs: NaslegLocation[];
  towns: TownLocation[];
}

export default function Edit({ id }: { id: string }) {
  const [data, setData] = useState<Material | null>(null);
  const [material, setMaterial] = useState<Material>(defaultMaterial);
  const [updatedMaterial, setUpdatedMaterial] = useState<Partial<Material>>({});
  const [baseDictionary, setBaseDictionary] = useState<{
    [key: string]: any[];
  }>({});
  const [isEdited, setIsEdited] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sending, setSending] = useState(false);

  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);

  const [selectedDistricts, setSelectedDistricts] = useState<
    DistrictLocation[]
  >([]);
  const [selectedNaslegs, setSelectedNaslegs] = useState<NaslegLocation[]>([]);
  const [selectedTowns, setSelectedTowns] = useState<TownLocation[]>([]);

  const [showAddFileModal, setShowAddFileModal] = useState(false);
  const [showAddImageModal, setShowAddImageModal] = useState(false);

  const [fileTitle, setFileTitle] = useState<string | null>(null);
  const [fileList, setFileList] = useState<FileList | null>(null);

  const [imageTitle, setImageTitle] = useState<string | null>(null);
  const [imageList, setImageList] = useState<FileList | null>(null);

  const [sectionDictionary, setSectionDictionary] =
    useState<SectionDictionary | null>(null);

  const handleSetBaseDictionary = <T,>(
    promiseResult: PromiseSettledResult<T>,
    key: string,
    setter: React.Dispatch<React.SetStateAction<T>>
  ): T | null | undefined => {
    if (promiseResult.status === 'fulfilled') {
      const promiseData = promiseResult.value;

      setter((prev) => ({ ...prev, [key]: promiseData }));

      return promiseData;
    } else if (promiseResult.status === 'rejected') {
      console.error(promiseResult.reason);

      return null;
    }
  };

  const [locationDictionary, setLocationDictionary] =
    useState<LocationDictionary | null>(null);

  const [showSectionModal, setShowSectionModal] = useState(false);

  const [sectionData, setSectionData] = useState<{
    cellValue: string;
    rackValue: string;
    sectionValue: string;
    shelfValue: string;
  }>({ cellValue: '', rackValue: '', sectionValue: '', shelfValue: '' });

  useEffect(() => {
    setMaterial((prev) => ({
      ...prev,
      storageSection: [
        `Стеллаж: ${sectionData.rackValue}`,
        `Секция: ${sectionData.sectionValue}`,
        `Полка: ${sectionData.shelfValue}`,
        `Ячейка: ${sectionData.cellValue}`
      ].join(', ')
    }));
  }, [sectionData]);

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
      const p_materialshelfs = getDictionary('materialshelfs');

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
        r_materialbaseunits,
        r_materialshelfs
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
        p_materialbaseunits,
        p_materialshelfs
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

        if (data.data) {
          setMaterial(data.data);
        }
      }
      if (r_materialshelfs.status === 'fulfilled') {
        const data = r_materialshelfs.value;

        setSectionDictionary(data.data);
      }
      if (r_location.status === 'fulfilled') {
        const data = r_location.value;

        setLocationDictionary(data.data);
      }
      setIsLoaded(true);
    };

    fetchData();
  }, []);

  const updateMaterial = async () => {
    setSending(true);

    if (material) {
      const data = material;

      if (data.geometry) {
        delete data.geometry;
      }

      const response = await putSpatialData(id, data);

      if (response.success) {
        toast.success('Материал успешно сохранен');
        setSending(false);
      } else {
        toast.error('Ошибка при сохранении материала');
        setSending(false);
      }
    }
  };

  const set = (key: string, value: any) => {
    setMaterial((prev: any) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    (() => {
      setMaterial((prev) => ({
        ...prev,
        locationGuids: [
          ...selectedDistricts.map((d) => d.guid),
          ...selectedNaslegs.map((n) => n.guid),
          ...selectedTowns.map((t) => t.guid)
        ].join(','),
        location: [
          ...selectedDistricts.map((d) => d.fullName),
          ...selectedNaslegs.map((n) => n.name),
          ...selectedTowns.map((t) => t.name)
        ].join(',')
      }));
    })();
  }, [selectedDistricts, selectedNaslegs, selectedTowns]);

  const backHref = () => {
    const MODE = process.env.MODE;
    let href: string;

    if (MODE === 'production') {
      href = `/material/${id}`;
    } else if (MODE === 'local') {
      href = `/sakhagis/material/${id}`;
    } else if (MODE === 'development') {
      href = `/sakhagis/material/${id}`;
    } else {
      href = '';
    }

    return href;
  };

  const returnRepoSrc = (code: string | null, ext: string | null) => {
    const MODE = process.env.MODE;
    let src: string;

    if (MODE === 'production') {
      src = `/apimap/repo/${code}${ext}`;
    } else if (MODE === 'local') {
      src = `/sakhagis/apimap/repo/${code}${ext}`;
    } else if (MODE === 'development') {
      src = `https://yakit.pro/sakhagis/apimap/repo/${code}.${ext}`;
    } else {
      src = '';
    }

    return src;
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

  const sendFile = async () => {
    const files = fileList;

    if (!files) return;

    const formData = new FormData();

    // Append each file to FormData
    for (let i = 0; i < files.length; i++) {
      formData.append('tip', 'file');
      formData.append('obj', 'material');
      formData.append('obj_code', id);
      formData.append('obj_field', 'storagedfile');
      formData.append('title', fileTitle ?? 'Безымянный файл');
      formData.append('files', files[i]);
    }

    // Исправить здесь при проблемах уведомления об успешной/ошибке загрузке
    try {
      const repoResponse = await uploadRepoFile(formData);

      toast.success('Файл успешно загружен');
      setShowAddFileModal(false);
    } catch {
      toast.error('Ошибка при загрузке файла');
    }
  };

  const sendImage = async () => {
    const files = imageList;

    if (!files) return;

    const formData = new FormData();

    // Append each file to FormData
    for (let i = 0; i < files.length; i++) {
      formData.append('tip', 'file');
      formData.append('obj', 'material');
      formData.append('obj_code', id);
      formData.append('obj_field', 'attachedfile');
      formData.append('title', imageTitle ?? 'Безымянный файл');
      formData.append('files', files[i]);
    }

    // Исправить здесь при проблемах уведомления об успешной/ошибке загрузке
    try {
      const repoResponse = await uploadRepoFile(formData);

      toast.success('Изображение успешно загружено');
      setShowAddFileModal(false);
    } catch {
      toast.error('Ошибка при загрузке изображения');
    }
  };

  return (
    <div className="h-full overflow-auto px-[30px]">
      <div className="grid h-full grid-cols-4 gap-6 py-[30px]">
        <Card className="col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Pencil className="mr-2" size={20} />
              Редактирование материала
            </CardTitle>
          </CardHeader>
          <CardContent className="relative flex-1 p-0">
            <div className="left-0 top-0 h-full w-full space-y-4 p-6 pt-0">
              {isLoaded && (
                <>
                  <TextareaItem
                    label="Наименование*"
                    placeholder="Введите наименование материала"
                    value={material?.name ?? undefined}
                    onChange={(event) => set('name', event.target.value)}
                  />
                  <BaseItem
                    label="Главный географический объект"
                    value={material?.mainGeoObjectName}
                    onChange={(event) =>
                      set('mainGeoObjectName', event.target.value)
                    }
                  />
                  <BaseItem
                    label="Короткое наименование*"
                    value={material?.shortName}
                    onChange={(event) => set('shortName', event.target.value)}
                  />
                  <BaseLabel label="Вид пространнственных данных*">
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
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите вид пространнственных данных" />
                      </SelectTrigger>
                      <SelectContent>
                        {baseDictionary.materialtypes?.map((item: any) => (
                          <SelectItem value={item?.id}>{item?.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </BaseLabel>
                  <BaseItem
                    label="Инвентарный номер*"
                    value={material?.inventarNumber}
                    onChange={(event) =>
                      set('inventarNumber', event.target.value)
                    }
                  />
                  <BaseLabel label="Система координат*">
                    <Select
                      value={
                        baseDictionary?.coordinateSystems?.find(
                          (item) => item?.id == material?.baseType
                        )?.id
                      }
                      onValueChange={(value) =>
                        setMaterial((prev) => ({
                          ...prev,
                          coordinateSystem: Number(value) ?? null
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
                  <BaseItem
                    label="Проекция"
                    value={material?.projection}
                    onChange={(event) => set('projection', event.target.value)}
                  />
                  <TextareaItem
                    label="Конур простр. данных в формате GeoJSON"
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
                        className="max-h-[250px] min-w-52 overflow-auto"
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
                  <BaseLabel label="Организация изготовитель*">
                    <Select
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
                    label="Правообладатель"
                    value={material?.mapOwner}
                    onChange={(event) => set('projection', event.target.value)}
                  />
                  <BaseLabel label="Секция хранения">
                    <div>
                      <Input
                        disabled
                        placeholder="Выберите секцию хранения"
                        value={material.storageSection ?? ''}
                      />
                      <Button
                        className="h-auto p-0 text-blue-500"
                        variant="link"
                        size="sm"
                        onClick={() => setShowSectionModal(true)}
                      >
                        Выбрать секцию хранения
                      </Button>
                    </div>
                  </BaseLabel>
                  <BaseItemNumber
                    label="Масштаб"
                    value={material?.scale}
                    onChange={(event) => set('scale', event.target.value)}
                  />
                  <BaseItemNumber
                    label="Год создания*"
                    value={material?.yearCreate}
                    onChange={(event) => set('yearCreate', event.target.value)}
                  />
                  <BaseItemNumber
                    label="Год соответствия местности*"
                    value={material?.yearConformity}
                    onChange={(event) =>
                      set('yearConformity', event.target.value)
                    }
                  />
                  <BaseLabel label="Секретность*">
                    <Select
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
                  <BaseItem
                    label="Условия доступа"
                    value={material?.accessConditions}
                    onChange={(event) =>
                      set('accessConditions', event.target.value)
                    }
                  />
                  <BaseLabel label="Местоположение">
                    <div>
                      <Input
                        placeholder="Выберите местоположение"
                        value={material.location ?? ''}
                        onChange={(e) => {
                          console.log(e.target.value);
                          debugger;
                        }}
                        disabled
                      />
                      <Button
                        className="h-auto p-0 text-blue-500"
                        variant="link"
                        size="sm"
                        onClick={() => setShowLocationModal(true)}
                      >
                        Выбрать
                      </Button>
                    </div>
                  </BaseLabel>
                  <BaseLabel label="Базовый тип*">
                    <Select
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
                  <BaseLabel label="Статус*">
                    <Select
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
                  <BaseLabel label="Форма предоставления данных*">
                    <Select
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
                        <SelectValue placeholder="Выберите вид пространнственных данных" />
                      </SelectTrigger>
                      <SelectContent>
                        {baseDictionary.displayforms?.map((item: any) => (
                          <SelectItem value={item?.id}>{item?.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </BaseLabel>
                  <BaseItemNumber
                    label="Площадь по рамке листа, кв.м."
                    value={material?.areaBySheetFrameSquareMeter}
                    onChange={(event) =>
                      set('areaBySheetFrameSquareMeter', event.target.value)
                    }
                  />
                  <BaseItemNumber
                    label="Количество листов карты"
                    value={material?.numberOfSheets}
                    onChange={(event) =>
                      set('numberOfSheets', event.target.value)
                    }
                  />
                  <BaseItemNumber
                    label="Количество кадров"
                    value={material?.numberOfUnits}
                    onChange={(event) =>
                      set('numberOfUnits', event.target.value)
                    }
                  />
                  <BaseItem
                    label="WMS-слой"
                    value={material?.wmsLayer}
                    onChange={(event) => set('wmsLayer', event.target.value)}
                  />
                  <BaseItem
                    label="Вид изображения"
                    value={material?.imageType}
                    onChange={(event) => set('imageType', event.target.value)}
                  />
                  <BaseItem
                    label="Разрешение"
                    value={material?.resolution}
                    onChange={(event) => set('resolution', event.target.value)}
                  />
                  <BaseItem
                    label="Точность"
                    value={material?.accuracy}
                    onChange={(event) => set('accuracy', event.target.value)}
                  />
                  <BaseItemNumber
                    label="Облачность. %"
                    value={material?.cloudiness}
                    onChange={(event) =>
                      set('cloudiness', Number(event.target.value))
                    }
                  />
                  <BaseItemNumber
                    label="Широта*"
                    value={material?.lat}
                    onChange={(event) => set('lat', event.target.value)}
                  />
                  <BaseItemNumber
                    label="Долгота*"
                    value={material?.lng}
                    onChange={(event) => set('lng', event.target.value)}
                  />
                  <BaseLabel label="Базовая расчетная единица*">
                    <Select
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
                </>
              )}
              {!isLoaded && (
                <>
                  {new Array(10).fill(null).map((_, index) => (
                    <div className="space-y-1.5" key={index}>
                      <Skeleton className="h-3 w-[200px]" />
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
              <div className="h-[500px] overflow-hidden rounded-lg bg-gray-200">
                <Map
                  type="spatial-data"
                  geometry={material?.geometryString ?? ''}
                  onSetGeometry={(coordinates) => {
                    if (coordinates) {
                      set('lng', coordinates[0]);
                      set('lat', coordinates[1]);
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                Изображения предпросмотра пространственных данных
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddImageModal(true)}
              >
                Загрузить изображение
              </Button>
            </CardHeader>
            <CardContent>
              {material?.repoFiles?.repoAttachedFiles &&
              material?.repoFiles?.repoAttachedFiles?.length > 0 ? (
                <div className="grid grid-cols-4 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {material?.repoFiles.repoAttachedFiles.map((file) => (
                    <img
                      src={`${returnRepoSrc(file?.code, 'jpg')}`}
                      alt="Preview 1"
                      className="h-auto w-[400px] rounded-lg"
                    />
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  Нет доступных файлов
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Файлы пространственных данных</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddFileModal(true)}
              >
                Загрузить файлы
              </Button>
            </CardHeader>
            <CardContent>
              {data?.repoFiles?.repoStorageFiles &&
              data?.repoFiles.repoStorageFiles.length > 0 ? (
                <div className="grid grid-cols-4 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {data?.repoFiles.repoStorageFiles.map((file) =>
                    renderDoc(file)
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
          <a href={backHref()}>
            <Button variant="outline">
              <ArrowLeft className="mr-2" size={16} />
              Назад
            </Button>
          </a>
          <Button onClick={updateMaterial} disabled={!isLoaded || sending}>
            {sending ? (
              <>
                Сохранение{' '}
                <LoaderCircle className="ml-2 animate-spin duration-500" />
              </>
            ) : (
              'Сохранить изменения'
            )}
          </Button>
        </div>
      </div>

      <Dialog open={showLocationModal} onOpenChange={setShowLocationModal}>
        <DialogContent
          defaultClose={false}
          className="z-[1000] sm:max-w-[1000px]"
        >
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="max-w-[80%]">
              Выбор местоположения
            </DialogTitle>
            <DialogClose asChild>
              <Button size="icon" variant="ghost">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardHeader>
                <CardTitle>Районы</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {locationDictionary &&
                      locationDictionary.districts.map((district) => (
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            checked={selectedDistricts.some(
                              (sDistrict) => sDistrict.name === district.name
                            )}
                            onCheckedChange={() => {
                              setSelectedNaslegs([]);
                              setSelectedTowns([]);

                              selectedDistricts.some(
                                (sDistrict) => sDistrict.name === district.name
                              )
                                ? setSelectedDistricts((prev) =>
                                    prev.filter(
                                      (item) => item.name !== district.name
                                    )
                                  )
                                : setSelectedDistricts((prev) => [
                                    ...prev,
                                    district
                                  ]);
                            }}
                          />
                          <Label>{district.fullName}</Label>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Наслеги</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {locationDictionary &&
                      locationDictionary.naslegs
                        .filter((nasleg) =>
                          selectedDistricts.some(
                            (sDistrict) => sDistrict.id === nasleg.districtID
                          )
                        )
                        .map((nasleg) => (
                          <div className="flex items-start space-x-2">
                            <Checkbox
                              checked={selectedNaslegs.some(
                                (sNasleg) => sNasleg.name === nasleg.name
                              )}
                              onCheckedChange={() => {
                                setSelectedTowns([]);

                                selectedNaslegs.some(
                                  (sNasleg) => sNasleg.name === nasleg.name
                                )
                                  ? setSelectedNaslegs((prev) =>
                                      prev.filter(
                                        (item) => item.name !== nasleg.name
                                      )
                                    )
                                  : setSelectedNaslegs((prev) => [
                                      ...prev,
                                      nasleg
                                    ]);
                              }}
                            />
                            <Label>{nasleg.name}</Label>
                          </div>
                        ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Населенные пункты</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {locationDictionary &&
                      locationDictionary.towns
                        .filter((town) =>
                          selectedNaslegs.some(
                            (sNasleg) => sNasleg.id === town.naslegID
                          )
                        )
                        .map((town) => (
                          <div className="flex items-start space-x-2">
                            <Checkbox
                              checked={selectedTowns.some(
                                (sTown) => sTown.name === town.name
                              )}
                              onCheckedChange={() =>
                                selectedTowns.some(
                                  (sTown) => sTown.name === town.name
                                )
                                  ? setSelectedTowns((prev) =>
                                      prev.filter(
                                        (item) => item.name !== town.name
                                      )
                                    )
                                  : setSelectedTowns((prev) => [...prev, town])
                              }
                            />
                            <Label>{town.name}</Label>
                          </div>
                        ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          <div className="mt-3 flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setShowLocationModal(false);
                setSelectedDistricts([]);
                setSelectedNaslegs([]);
                setSelectedTowns([]);
              }}
            >
              Отмена
            </Button>
            <Button
              onClick={() => {
                setShowLocationModal(false);
              }}
            >
              Подтвердить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSectionModal} onOpenChange={setShowSectionModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Секция хранения</DialogTitle>
          </DialogHeader>
          <div>
            <Label>Стеллаж:</Label>
            <Select
              value={sectionData.rackValue}
              onValueChange={(value) =>
                setSectionData((prev) => ({
                  ...prev,
                  rackValue: value
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите стеллаж" />
              </SelectTrigger>
              <SelectContent>
                {sectionDictionary?.rackValues.map((item) => (
                  <SelectItem value={item}>{item}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Секция:</Label>
            <Select
              value={sectionData.sectionValue}
              onValueChange={(value) =>
                setSectionData((prev) => ({
                  ...prev,
                  sectionValue: value
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите секцию" />
              </SelectTrigger>
              <SelectContent>
                {sectionDictionary?.sectionValues.map((item) => (
                  <SelectItem value={item}>{item}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Полка:</Label>
            <Select
              value={sectionData.shelfValue}
              onValueChange={(value) =>
                setSectionData((prev) => ({
                  ...prev,
                  shelfValue: value
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите полку" />
              </SelectTrigger>
              <SelectContent>
                {sectionDictionary?.shelfValues.map((item) => (
                  <SelectItem value={item}>{item}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Ячейка:</Label>
            <Select
              value={sectionData.cellValue}
              onValueChange={(value) =>
                setSectionData((prev) => ({
                  ...prev,
                  cellValue: value
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите ячейку" />
              </SelectTrigger>
              <SelectContent>
                {sectionDictionary?.cellValues.map((item) => (
                  <SelectItem value={item}>{item}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddFileModal} onOpenChange={setShowAddFileModal}>
        <DialogContent defaultClose={false} className="sm:max-w-[700px]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="max-w-[80%]">
              Загрузить Пространственные файлы
            </DialogTitle>
            <DialogClose asChild>
              <Button size="icon" variant="ghost">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Название файла</Label>
            <Input
              className="w-full"
              type="text"
              placeholder="Введите наименование файла"
              value={fileTitle ?? ''}
              onChange={(event) => setFileTitle(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Input
              className="w-full"
              type="file"
              onChange={(event) => setFileList(event.target.files)}
            />
          </div>
          <div className="mt-3 flex justify-between">
            <Button variant="outline">Отмена</Button>
            <Button
              onClick={() => {
                sendFile();
              }}
              disabled={!fileTitle || !fileList}
            >
              Подтвердить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddImageModal} onOpenChange={setShowAddImageModal}>
        <DialogContent defaultClose={false} className="sm:max-w-[700px]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="max-w-[80%]">
              Загрузить изображение предпросмотра пространственных данных
            </DialogTitle>
            <DialogClose asChild>
              <Button size="icon" variant="ghost">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogHeader>
          <div>
            <Label>Название файла</Label>
            <Input
              className="w-full"
              type="text"
              placeholder="Введите наименование файла"
              value={imageTitle ?? ''}
              onChange={(event) => setImageTitle(event.target.value)}
            />
          </div>
          <div>
            <Input
              className="w-full"
              type="file"
              onChange={(event) => setImageList(event.target.files)}
            />
          </div>
          <div className="mt-3 flex justify-between">
            <Button variant="outline">Отмена</Button>
            <Button
              onClick={() => {
                sendImage();
              }}
              disabled={!imageTitle || !imageList}
            >
              Подтвердить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
