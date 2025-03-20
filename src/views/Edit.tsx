import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Pencil,
  ChevronDown,
  LoaderCircle,
  X,
  Check,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Map from 'MapProvider/MapComponentContainer';

import '@/assets/global.css';

import {
  deleteRepoFile,
  deleteSpatialData,
  getDictionary,
  getDictionaryFundsettings,
  getSpatialData,
  putSpatialData,
  uploadRepoFile
} from '@/api';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

import { AttachedFile, Material, RepoFile } from '@/types/spatialData';
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
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

import returnRepoSrc from '@/helpers/returnRepoSrc';
import returnFileSrcFromPath from '@/helpers/returnFileSrcFromPath';
import returnModifiedMaterialData from '@/helpers/returnModifieMaterialData';
import returnModifieLocationDictionary from '@/helpers/returnModifieLocationDictionary';
import SpatialImages from '@/modules/SpatialImages';
import republicDictItem from '@/utils/constants/republicDictItem';
import TownCheckbox from '@/components/TownCheckbox';

import initialMaterial from '@/utils/initialMaterial';

interface SectionDictionary {
  cellValues: string[];
  rackValues: string[];
  sectionValues: string[];
  shelfValues: string[];
}

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

export default function Edit({ id }: { id: string }) {
  const [material, setMaterial] = useState<Material>(initialMaterial);
  const [baseDictionary, setBaseDictionary] = useState<{
    [key: string]: any[];
  }>({});
  const [unitedLocationList, setUnitedLocationList] = useState<
    { guid: string; name: string }[] | null
  >(null);
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

  const [expandedImage, setExpandedImage] = useState<
    RepoFile | AttachedFile | null
  >(null);

  const [sectionDictionary, setSectionDictionary] =
    useState<SectionDictionary | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessDeleteModal, setShowSuccessDeleteModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

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
          const material = data.data;
          const modifiedMaterial = returnModifiedMaterialData(material);

          setMaterial(modifiedMaterial);
        }
      }
      if (r_materialshelfs.status === 'fulfilled') {
        const data = r_materialshelfs.value;

        setSectionDictionary(data.data);
      }
      if (r_location.status === 'fulfilled') {
        const data = r_location.value;

        if (data.data) {
          const locationDictionary = data.data;
          const modifiedLocationDictionary =
            returnModifieLocationDictionary(locationDictionary);
          setUnitedLocationList([
            ...modifiedLocationDictionary.districts.map((item) => ({
              name: item.fullName,
              guid: item.guid
            })),
            ...modifiedLocationDictionary.naslegs.map((item) => ({
              name: item.name,
              guid: item.guid
            })),
            ...modifiedLocationDictionary.towns.map((item) => ({
              name: item.name,
              guid: item.guid
            }))
          ]);

          setLocationDictionary(modifiedLocationDictionary);
        }
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
      } else {
        toast.error('Ошибка при сохранении материала');
      }
      setSending(false);
    }
  };

  const deleteMaterial = async () => {
    setSending(true);

    if (material) {
      const response = await deleteSpatialData(id);

      if (response.success) {
        toast.info('Материал успешно удален');
        setShowSuccessDeleteModal(true);
      } else {
        toast.error('Не удалось удалить материал');
      }
      setShowDeleteModal(false);
      setSending(false);
    }
  };

  const deleteFile = async (
    type: 'file' | 'image',
    code: string,
    uuid?: string
  ) => {
    if (!code) return;
    setSending(true);

    try {
      const response = await deleteRepoFile(code);

      if (response.success) {
        toast.info('Файл успешно удален');

        if (type === 'file') {
          setMaterial((prev) => {
            return {
              ...prev,
              repoFiles: prev.repoFiles
                ? {
                    ...prev.repoFiles,
                    repoStorageFiles: prev.repoFiles.repoStorageFiles.filter(
                      (item) => item.uuid !== uuid
                    )
                  }
                : prev.repoFiles
            };
          });
        } else if (type === 'image') {
          setMaterial((prev) => {
            return {
              ...prev,
              repoFiles: prev.repoFiles
                ? {
                    ...prev.repoFiles,
                    repoAttachedFiles: prev.repoFiles.repoAttachedFiles.filter(
                      (item) => item.uuid !== uuid
                    )
                  }
                : prev.repoFiles
            };
          });
        }
      } else {
        toast.error('Не удалось удалить файл');
      }
    } catch (error) {
      console.error(error);
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
        ]
          .map((item) => item.trim())
          .join(','),
        location: [
          ...selectedDistricts.map((d) => d.fullName),
          ...selectedNaslegs.map((n) => n.name),
          ...selectedTowns.map((t) => t.name)
        ]
          .map((item) => item.trim())
          .join(',')
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

  const backToListHref = () => {
    const MODE = process.env.MODE;
    let href: string;

    if (MODE === 'production') {
      href = `/material`;
    } else if (MODE === 'local') {
      href = `/sakhagis/material`;
    } else if (MODE === 'development') {
      href = `/sakhagis/material`;
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

  const sendFile = async () => {
    const files = fileList;

    if (!files) return;

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('tip', 'file');
      formData.append('obj', 'material');
      formData.append('obj_code', id);
      formData.append('obj_field', 'storagefile');
      formData.append('title', fileTitle ?? 'Безымянный файл');
      formData.append('files', files[i]);
    }

    setIsLoading(true);

    try {
      const repoResponse = await uploadRepoFile(formData);

      if (repoResponse.success && repoResponse.data) {
        setMaterial((prev) => {
          return {
            ...prev,
            repoFiles: prev.repoFiles
              ? {
                  ...prev.repoFiles,
                  repoStorageFiles: [
                    ...prev.repoFiles.repoStorageFiles,
                    ...(repoResponse.data as any)
                  ]
                }
              : prev.repoFiles
          };
        });

        toast.success('Файл успешно загружен');
        setShowAddFileModal(false);
      } else {
        toast.error('Ошибка при загрузке файла');
      }
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  const sendImage = async () => {
    const files = imageList;

    if (!files) return;

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('tip', 'file');
      formData.append('obj', 'material');
      formData.append('obj_code', id);
      formData.append('obj_field', 'attachedfile');
      formData.append('title', imageTitle ?? 'Безымянный файл');
      formData.append('files', files[i]);
    }

    setIsLoading(true);

    try {
      const repoResponse = await uploadRepoFile(formData);

      if (repoResponse.success) {
        setMaterial((prev) => {
          return {
            ...prev,
            repoFiles: prev.repoFiles
              ? {
                  ...prev.repoFiles,
                  repoAttachedFiles: [
                    ...prev.repoFiles.repoAttachedFiles,
                    ...(repoResponse.data as RepoFile[])
                  ]
                }
              : prev.repoFiles
          };
        });

        toast.success('Изображение успешно загружено');
        setShowAddImageModal(false);
      } else {
        toast.error('Ошибка при загрузке изображения');
      }
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
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
                    label="Наименование"
                    placeholder="Введите наименование материала"
                    value={material?.name ?? undefined}
                    onChange={(event) => set('name', event.target.value)}
                    required
                  />
                  <BaseItem
                    label="Главный географический объект"
                    value={material?.mainGeoObjectName}
                    onChange={(event) =>
                      set('mainGeoObjectName', event.target.value)
                    }
                  />
                  <BaseItem
                    label="Короткое наименование"
                    value={material?.shortName}
                    onChange={(event) => set('shortName', event.target.value)}
                    required
                  />
                  <BaseLabel label="Вид пространственных данных" required>
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
                    label="Инвентарный номер"
                    value={material?.inventarNumber}
                    onChange={(event) =>
                      set('inventarNumber', event.target.value)
                    }
                    required
                  />
                  <BaseLabel label="Система координат" required>
                    <Select
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
                  <BaseLabel label="Организация-изготовитель" required>
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
                    label="Год создания"
                    value={material?.yearCreate}
                    onChange={(event) => set('yearCreate', event.target.value)}
                    required
                  />
                  <BaseItemNumber
                    label="Год соответствия местности"
                    value={material?.yearConformity}
                    onChange={(event) =>
                      set('yearConformity', event.target.value)
                    }
                    required
                  />
                  <BaseLabel label="Секретность" required>
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
                        value={
                          material.locationGuids
                            ?.split(',')
                            .map((item) =>
                              unitedLocationList?.find(
                                (unitedItem) => unitedItem.guid === item
                              )?.name
                            )
                            .join(', ') ?? ''
                        }
                        onChange={(e) => {}}
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
                  <BaseLabel label="Базовый тип" required>
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
                  <BaseLabel label="Статус" required>
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
                  <BaseLabel label="Форма предоставления данных" required>
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
                        <SelectValue placeholder="Выберите вид пространственных данных" />
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
                    label="Широта"
                    value={material?.lat}
                    onChange={(event) => set('lat', event.target.value)}
                    required
                  />
                  <BaseItemNumber
                    label="Долгота"
                    value={material?.lng}
                    onChange={(event) => set('lng', event.target.value)}
                    required
                  />
                  <BaseLabel label="Базовая расчетная единица" required>
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
                  onDrawed={(geo) => set('geometryString', JSON.stringify(geo))}
                />
              </div>
            </CardContent>
          </Card>

          <SpatialImages
            repoAttachedFiles={material?.repoFiles?.repoAttachedFiles}
            attachedFilesList={material?.attachedFilesList}
            onClickDownLoad={() => setShowAddImageModal(true)}
            onClickImage={(file) => setExpandedImage(file)}
            onClickDelete={(file) => {
              if ('code' in file) deleteFile('image', file.code, file?.uuid);
            }}
          />

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
                <div className="flex flex-wrap gap-4">
                  {material?.repoFiles.repoStorageFiles.map((file) => (
                    <div className="flex items-center gap-2">
                      {renderDoc(file)}
                      <Button
                        className="h-7 w-7"
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFile('file', file.code, file?.uuid);
                        }}
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
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
          <a href={backHref()}>
            <Button variant="outline">
              <ArrowLeft className="mr-2" size={16} />
              Назад
            </Button>
          </a>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              disabled={!isLoaded || sending}
              onClick={() => setShowDeleteModal(true)}
            >
              Удалить материал
            </Button>
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
                              if (district.guid === republicDictItem.guid) {
                                setSelectedDistricts([]);
                                setSelectedNaslegs([]);
                                setSelectedTowns([]);

                                const disabledDistricts =
                                  locationDictionary.districts.map((item) => {
                                    if (item.guid !== republicDictItem.guid)
                                      return { ...item, disabled: true };
                                    return item;
                                  });
                                const defaultDistricts =
                                  locationDictionary.districts.map((item) => {
                                    if (item.guid !== republicDictItem.guid)
                                      return { ...item, disabled: false };
                                    return item;
                                  });

                                if (
                                  selectedDistricts.some(
                                    (sDistrict) =>
                                      sDistrict.name === district.name
                                  )
                                ) {
                                  setSelectedDistricts((prev) =>
                                    prev.filter(
                                      (item) => item.name !== district.name
                                    )
                                  );
                                  setLocationDictionary((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          districts: defaultDistricts
                                        }
                                      : prev
                                  );
                                } else {
                                  setSelectedDistricts((prev) => [
                                    ...prev,
                                    district
                                  ]);
                                  setLocationDictionary((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          districts: disabledDistricts
                                        }
                                      : prev
                                  );
                                }

                                return;
                              }

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
                            disabled={district?.disabled}
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
                            (sDistrict) =>
                              String(sDistrict.id) === String(nasleg.districtID)
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
                    {locationDictionary?.towns?.map((town) => {
                      const isTownVisible =
                        (selectedNaslegs.length > 0 &&
                          selectedNaslegs.some(
                            (sNasleg) => sNasleg.id === town.naslegID
                          )) ||
                        (selectedNaslegs.length === 0 &&
                          selectedDistricts.some(
                            (sDistrict) =>
                              String(sDistrict.id) === String(town.districtID)
                          ));

                      if (!isTownVisible) return null;

                      return (
                        <TownCheckbox
                          key={town.id}
                          town={town}
                          selected={selectedTowns}
                          onToggle={setSelectedTowns}
                        />
                      );
                    })}
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
            <Input
              className="w-full"
              type="file"
              multiple
              onChange={(event) => setFileList(event.target.files)}
            />
          </div>
          <div className="mt-3 flex justify-between">
            <Button variant="outline">Отмена</Button>
            <Button
              onClick={() => {
                sendFile();
              }}
              disabled={!fileList?.length || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  В процессе <LoaderCircle className="h-4 w-4 animate-spin" />
                </span>
              ) : (
                <>Подтвердить</>
              )}
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
            <Input
              className="w-full"
              type="file"
              multiple
              onChange={(event) => setImageList(event.target.files)}
            />
          </div>
          <div className="mt-3 flex justify-between">
            <Button variant="outline">Отмена</Button>
            <Button
              onClick={() => {
                sendImage();
              }}
              disabled={!imageList?.length || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  В процессе <LoaderCircle className="h-4 w-4 animate-spin" />
                </span>
              ) : (
                <>Подтвердить</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удаление материала</DialogTitle>
            <DialogDescription>
              Вы уверены что хотите удалить материал?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={() => deleteMaterial()}>
              {sending ? (
                <>
                  Удаление{' '}
                  <LoaderCircle className="ml-2 animate-spin duration-500" />
                </>
              ) : (
                'Удалить материал'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessDeleteModal}>
        <DialogContent defaultClose={false}>
          <DialogHeader>
            <DialogTitle className="item-center flex gap-2">
              Материал успешно удален{' '}
              <Check className="h-4 w-4 text-green-400" />
            </DialogTitle>
            <DialogDescription>
              Материал "{material?.name}" был удален
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <a href={backToListHref()}>
              <Button>Вернуться к списку материалов</Button>
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
