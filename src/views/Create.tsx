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
  ChevronDown,
  LoaderCircle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Map from 'MapProvider/MapComponentContainer';
import { v4 as uuidv4 } from 'uuid';

import '@/assets/global.css';

import {
  getDictionary,
  getDictionaryFundsettings,
  getSpatialData,
  postSpatialData,
  uploadRepoFile
} from '@/api';

import { Material, RepoFile } from '@/types/spatialData';
import BaseItem from '@/components/BaseItem';
import TextareaItem from '@/components/TextareaItem';
import BaseItemNumber from '@/components/BaseItemNumber';
import { toast } from 'react-toastify';
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { watch } from 'fs';
import { cn } from '@/lib/utils';
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
  serializedAdditionalFields: '',
  repoFiles: {
    repoAttachedFiles: [],
    repoStorageFiles: []
  }
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

export default function Create() {
  const [material, setMaterial] = useState<Material>(defaultMaterial);
  const [baseDictionary, setBaseDictionary] = useState<{
    [key: string]: any[];
  }>({});
  const [validation, setValidation] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sending, setSending] = useState(false);

  const [locationDictionary, setLocationDictionary] =
    useState<LocationDictionary | null>(null);

  const [showSectionModal, setShowSectionModal] = useState(false);

  const [sectionDictionary, setSectionDictionary] =
    useState<SectionDictionary | null>(null);

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

  const [id, setId] = useState<string>('');

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

    try {
      const repoResponse: RepoFile[] = await uploadRepoFile(formData);

      setMaterial((prev) => {
        return {
          ...prev,
          repoFiles: prev.repoFiles
            ? {
                ...prev.repoFiles,
                repoStorageFiles: [
                  ...prev.repoFiles.repoAttachedFiles,
                  ...repoResponse
                ]
              }
            : prev.repoFiles
        };
      });

      toast.success('Файл успешно загружен');
      setShowAddFileModal(false);
    } catch {
      toast.error('Ошибка при загрузке файла');
    }
  };

  useEffect(() => {
    if (!id) {
      const uuid = uuidv4();
      setId(uuid);
      set('guid', uuid);
    }
  }, [id]);

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

    try {
      const repoResponse: RepoFile[] = await uploadRepoFile(formData);

      // setMaterial((prev) => ({ ...prev, repoFiles: { ...prev.repoFiles,  } }))
      setMaterial((prev) => {
        debugger;

        return {
          ...prev,
          repoFiles: prev.repoFiles
            ? {
                ...prev.repoFiles,
                repoAttachedFiles: [
                  ...prev.repoFiles.repoAttachedFiles,
                  ...repoResponse
                ]
              }
            : prev.repoFiles
        };
      });

      toast.success('Изображение успешно загружено');
      setShowAddFileModal(false);
    } catch {
      toast.error('Ошибка при загрузке изображения');
    }
  };

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

  useEffect(() => {
    const fetchData = async () => {
      const p_delivery = getDictionary('delivery');
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
      handleSetBaseDictionary<any>(
        r_materialshelfs,
        'materialshelfs',
        setBaseDictionary
      );
      if (r_materialshelfs.status === 'fulfilled') {
        const data = r_materialshelfs.value;

        setSectionDictionary(data);
      }
      if (r_location.status === 'fulfilled') {
        const data = r_location.value;

        setLocationDictionary(data);
      }
      setIsLoaded(true);
    };

    fetchData();
  }, []);

  const set = (key: string, value: string | number) => {
    setMaterial((prev: any) => ({ ...prev, [key]: value }));
  };

  const addData = async () => {
    if (!isSubmit) setIsSubmit(true);

    const isValid = validate();

    if (!isValid) {
      setValidation(true);
      toast.warning('Заполните обязательные поля');

      return;
    }

    setSending(true);

    try {
      if (material) {
        await postSpatialData(material);

        toast.success('Материал успешно создан');
        setSending(false);
      }
    } catch (err) {
      toast.error('Ошибка при создании материала');
      setSending(false);
    }
  };

  const backHref = () => {
    const MODE = process.env.MODE;
    let href: string;

    if (MODE === 'production') {
      href = '/admin/fpd';
    } else if (MODE === 'local') {
      href = '/sakhagis/admin/fpd';
    } else if (MODE === 'development') {
      href = 'https://yakit.pro/sakhagis/admin/fpd';
    } else {
      href = '';
    }

    return href;
  };

  const validate = (): boolean => {
    return (
      material.shortName !== null &&
      material.shortName !== undefined &&
      material.shortName !== '' &&
      material.inventarNumber !== null &&
      material.inventarNumber !== undefined &&
      material.coordinateSystem !== null &&
      material.coordinateSystem !== undefined &&
      material.materialCreatorId !== null &&
      material.materialCreatorId !== undefined &&
      material.yearCreate !== null &&
      material.yearCreate !== undefined &&
      material.yearConformity !== null &&
      material.yearConformity !== undefined &&
      material.secretStatus !== null &&
      material.secretStatus !== undefined &&
      material.materialTypeId !== null &&
      material.materialTypeId !== undefined &&
      material.baseType !== null &&
      material.baseType !== undefined &&
      material.status !== null &&
      material.status !== undefined &&
      material.displayForm !== null &&
      material.displayForm !== undefined &&
      material.baseUnitOfAccount !== null &&
      material.baseUnitOfAccount !== undefined &&
      material.lat !== null &&
      material.lat !== undefined &&
      material.lng !== null &&
      material.lng !== undefined
    );
  };

  useEffect(() => {
    if (!isSubmit) return;

    const isValid = validate();
    console.log(isValid);
    setValidation(!isValid);
  }, [material]);

  const [sectionData, setSectionData] = useState<{
    cellValue: string;
    rackValue: string;
    sectionValue: string;
    shelfValue: string;
  }>({ cellValue: '', rackValue: '', sectionValue: '', shelfValue: '' });

  useEffect(() => {
    setMaterial((prev) => ({
      ...prev,
      storageSection: `${sectionData.shelfValue}${sectionData.sectionValue ? `,${sectionData.sectionValue}` : ''}${sectionData.rackValue ? `,${sectionData.rackValue}` : ''}${sectionData.cellValue ? `,${sectionData.cellValue}` : ''}`
    }));
  }, [sectionData]);

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

  return (
    <div className="h-full overflow-auto px-[30px]">
      <div className="grid gap-6 py-[30px] grid-cols-4">
        <Card className="flex flex-col col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPinPlus className="mr-2" size={20} />
              Создание материала
            </CardTitle>
          </CardHeader>
          <CardContent className="relative flex-1 p-0">
            <div className="left-0 top-0 h-full w-full space-y-4 p-6 pt-0">
              {isLoaded && (
                <>
                  <BaseItem
                    className={cn({
                      'ring ring-red-500/50':
                        material?.name === '' && validation
                    })}
                    label="Наименование*"
                    value={material?.name}
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
                    className={cn({
                      'ring ring-red-500/50':
                        material?.shortName === '' && validation
                    })}
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
                      <SelectTrigger
                        className={cn({
                          'ring ring-red-500/50':
                            material?.materialTypeId === null && validation
                        })}
                      >
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
                    className={cn({
                      'ring ring-red-500/50':
                        material?.inventarNumber === null && validation
                    })}
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
                      <SelectTrigger
                        className={cn({
                          'ring ring-red-500/50':
                            material?.coordinateSystem === null && validation
                        })}
                      >
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
                                    formats:
                                      prev.formats &&
                                      !prev.formats.includes(item)
                                        ? [...prev.formats, item]
                                        : prev.formats &&
                                            prev.formats.includes(item)
                                          ? prev.formats.filter(
                                              (i) => i !== item
                                            )
                                          : null
                                  }));
                                }}
                                onSelect={(event) => event.preventDefault()}
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
                      <SelectTrigger
                        className={cn({
                          'ring ring-red-500/50':
                            material?.materialCreatorId === null && validation
                        })}
                      >
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
                    onChange={(event) => set('mapOwner', event.target.value)}
                  />
                  {/* TODO: Секция хранения */}
                  <BaseLabel label="Секция хранения">
                    <Input
                      disabled
                      placeholder="Выберите секцию хранения"
                      value={`${sectionData.shelfValue}${sectionData.sectionValue ? `,${sectionData.sectionValue}` : ''}${sectionData.rackValue ? `,${sectionData.rackValue}` : ''}${sectionData.cellValue ? `,${sectionData.cellValue}` : ''}`}
                    />
                    <Button
                      className="h-auto p-0 text-blue-500"
                      variant="link"
                      size="sm"
                      onClick={() => setShowSectionModal(true)}
                    >
                      Выбрать секцию хранения
                    </Button>
                  </BaseLabel>
                  <BaseItemNumber
                    label="Масштаб"
                    value={material?.scale}
                    onChange={(event) => set('scale', event.target.value)}
                  />
                  <BaseItemNumber
                    className={cn({
                      'ring ring-red-500/50':
                        material?.yearCreate === null && validation
                    })}
                    label="Год создания*"
                    value={material?.yearCreate}
                    onChange={(event) => set('yearCreate', event.target.value)}
                  />
                  <BaseItemNumber
                    className={cn({
                      'ring ring-red-500/50':
                        material?.yearConformity === null && validation
                    })}
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
                      <SelectTrigger
                        className={cn({
                          'ring ring-red-500/50':
                            !material?.secretStatus && validation
                        })}
                      >
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
                    <Input
                      placeholder="Выберите местоположение"
                      value={`${
                        selectedDistricts || selectedNaslegs || selectedTowns
                          ? `${selectedDistricts
                              .map((district) => district.name)
                              .join(
                                ','
                              )}${selectedNaslegs.length > 0 ? `,${selectedNaslegs.map((nasleg) => nasleg.name).join(',')}` : ''}${selectedTowns.length > 0 ? `,${selectedTowns.map((town) => town.name).join(',')}` : ''}`
                          : ''
                      }`}
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
                  </BaseLabel>
                  {/* TODO: Местонахождение территории */}
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
                      <SelectTrigger
                        className={cn({
                          'ring ring-red-500/50':
                            material?.baseType === null && validation
                        })}
                      >
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
                      <SelectTrigger
                        className={cn({
                          'ring ring-red-500/50':
                            material?.status === null && validation
                        })}
                      >
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
                      <SelectTrigger
                        className={cn({
                          'ring ring-red-500/50':
                            material?.displayForm === null && validation
                        })}
                      >
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
                    onChange={(event) => set('cloudiness', event.target.value)}
                  />
                  <BaseItemNumber
                    className={cn({
                      'ring ring-red-500/50':
                        material?.lat === null && validation
                    })}
                    label="Широта*"
                    value={material?.lat}
                    onChange={(event) => set('lat', event.target.value)}
                  />
                  <BaseItemNumber
                    className={cn({
                      'ring ring-red-500/50':
                        material?.lng === null && validation
                    })}
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
                      <SelectTrigger
                        className={cn({
                          'ring-2 ring-red-500/70 ring-offset-2':
                            material?.baseUnitOfAccount === null && validation
                        })}
                      >
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

        <div className="space-y-4 col-span-2">
          <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                <span>Контур пространственных данных</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="z-0 aspect-video overflow-hidden rounded-lg bg-gray-200">
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
                Загрузить изображения
              </Button>
            </CardHeader>
            <CardContent>
              {/* <pre>{JSON.stringify(material?.repoFiles, null, 2)}</pre> */}
              {material?.repoFiles?.repoAttachedFiles &&
              material?.repoFiles?.repoAttachedFiles?.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-4">
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
              {material?.repoFiles?.repoStorageFiles &&
              material?.repoFiles.repoStorageFiles.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-4">
                  {material?.repoFiles.repoStorageFiles.map((file) =>
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

        {false && (
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>
                Изображения предпросмотра пространственных данных
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-4">
                <img
                  src="/placeholder.svg?height=150&width=150"
                  alt="Preview 1"
                  className="h-auto w-full rounded-lg"
                />
                <img
                  src="/placeholder.svg?height=150&width=150"
                  alt="Preview 2"
                  className="h-auto w-full rounded-lg"
                />
                <img
                  src="/placeholder.svg?height=150&width=150"
                  alt="Preview 3"
                  className="h-auto w-full rounded-lg"
                />
                <img
                  src="/placeholder.svg?height=150&width=150"
                  alt="Preview 4"
                  className="h-auto w-full rounded-lg"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="col-span-4 flex justify-between pb-[30px]">
        <a href={backHref()}>
          <Button variant="outline">
            <ArrowLeft className="mr-2" size={16} />
            Назад
          </Button>
        </a>
        <Button
          onClick={addData}
          className={cn({ 'opacity-50': validation })}
          disabled={!isLoaded || sending}
        >
          {sending ? (
            <>
              Создание{' '}
              <LoaderCircle className="ml-2 animate-spin duration-500" />
            </>
          ) : (
            'Создать материал'
          )}
        </Button>
      </div>

      <Dialog open={showSectionModal} onOpenChange={setShowSectionModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Секция хранения</DialogTitle>
          </DialogHeader>
          <div>
            <Label>Стеллаж:</Label>
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
                <SelectValue placeholder="Выберите стеллаж" />
              </SelectTrigger>
              <SelectContent>
                {sectionDictionary?.shelfValues.map((item) => (
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
                <SelectValue placeholder="Выберите стеллаж" />
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
                <SelectValue placeholder="Выберите стеллаж" />
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
          <div className="mt-3 flex justify-between pb-[30px]">
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

      <Dialog open={showAddFileModal} onOpenChange={setShowAddFileModal}>
        <DialogContent defaultClose={false} className="sm:max-w-[700px]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="max-w-[80%]">
              Загрузить дополнительные документы
            </DialogTitle>
            <DialogClose asChild>
              <Button size="icon" variant="ghost">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogHeader>
          <div>
            <Input
              className="w-full"
              type="file"
              onChange={(event) => setFileList(event.target.files)}
            />
          </div>
          <div className="mt-3 flex justify-between">
            <Button variant="outline">Отмена</Button>
            <Button onClick={() => {}}>Подтвердить</Button>
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
              disabled={!fileTitle}
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
              disabled={!imageList}
            >
              Подтвердить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
