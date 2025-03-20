import React, { useEffect, useState } from 'react';
import { MapPin, ArrowLeft, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Map from 'MapProvider/MapComponentContainer';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

import '@/assets/global.css';

import {
  getCurrentUser,
  getDictionary,
  getDictionaryFundsettings,
  getSpatialData,
  postToCart
} from '@/api';

import returnRepoSrc from '@/helpers/returnRepoSrc';
import returnFileSrcFromPath from '@/helpers/returnFileSrcFromPath';

import { AttachedFile, Material, RepoFile } from '@/types/spatialData';
import { toast } from 'react-toastify';
import { Badge } from '@/components/ui/badge';
import SpatialImages from '@/modules/SpatialImages';
import returnModifieLocationDictionary from '@/helpers/returnModifieLocationDictionary';
import { LocationDictionary } from '@/types/general';

interface DetailProps {
  id: string;
}

export default function Detail({ id }: DetailProps) {
  const [data, setData] = useState<Material | null>(null);
  const [baseDictionary, setBaseDictionary] = useState<{
    [key: string]: any[];
  }>({});
  const [unitedLocationList, setUnitedLocationList] = useState<
    { guid: string; name: string }[] | null
  >(null);
  const [locationDictionary, setLocationDictionary] =
    useState<LocationDictionary | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cartCount, setCartCount] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [errorModal, setErrorModal] = useState<{
    isShow: boolean;
    title: string;
    description: string;
  }>({ isShow: false, title: '', description: '' });
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
      debugger;
      if (response.success && response.data) {
        setData(response.data);
      } else if (response.success === false && response.error?.status === 404) {
        setErrorModal({
          isShow: true,
          title: 'Материал не найден',
          description:
            'Запрашиваемый материал не существует или был удалён. Пожалуйста, проверьте ссылку или вернитесь к списку материалов'
        });
      } else if (response.success === false) {
        setErrorModal({
          isShow: true,
          title: 'Ошибка получения данных материала',
          description:
            'Произошла ошибка при попытке получить данные о материале. Попробуйте снова или обратитесь в поддержку, если проблема не исчезнет.'
        });
      }
    })();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const p_me = getCurrentUser();
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
        r_me,
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
        p_me,
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

        setData(data.data as any);
      }
      if (r_me.status === 'fulfilled') {
        const data: any = r_me.value;

        setCartCount(data.data.cartCount);
      }
      setIsLoaded(true);
    };

    fetchData();
  }, []);

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

  const backHref = () => {
    const MODE = process.env.MODE;
    let href: string;

    if (MODE === 'production') {
      href = '/material/';
    } else if (MODE === 'local') {
      href = '/sakhagis/material/';
    } else if (MODE === 'development') {
      href = 'https://yakit.pro/sakhagis/material/';
    } else {
      href = '';
    }

    return href;
  };

  const addToCart = async () => {
    setAdding(true);
    try {
      await postToCart({ materialId: id, quantity: 1 });

      toast.success('Заявление успешно добавлено');
      setCartCount((prev) => (prev ? prev + 1 : null));
      setAdding(false);
    } catch {
      toast.error('Ошибка добавления заявления');
      setAdding(false);
    }
  };

  const cartHref = () => {
    const MODE = process.env.MODE;
    let href: string;

    if (MODE === 'production') {
      href = '/lk?cart';
    } else if (MODE === 'local') {
      href = '/sakhagis/lk?cart';
    } else if (MODE === 'development') {
      href = '/sakhagis/lk?cart';
    } else {
      href = '';
    }

    return href;
  };

  const handleToggleErrorModal = (open: boolean) => {
    setErrorModal((prev) => ({ ...prev, isShow: open }));
  };

  return (
    <>
      <div className="h-full overflow-auto px-[30px]">
        <div className="mb-[30px] grid h-full grid-cols-4 gap-6 py-[30px]">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2" size={20} />
                Пространственные данные
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">Наименование</Label>
                  <p className="line-clamp-1">{data?.name}</p>
                </div>
                <div>
                  <Label className="font-medium">
                    Вид пространственных данных
                  </Label>
                  <p>
                    {
                      baseDictionary?.displayforms?.find(
                        (item) => item?.id == data?.displayForm
                      )?.name
                    }
                  </p>
                </div>
                <div>
                  <Label className="font-medium">
                    Местоположение территории
                  </Label>
                  <p>
                    {data?.locationGuids ? (
                      (data.locationGuids
                        ?.split(',')
                        .map(
                          (item) =>
                            unitedLocationList?.find(
                              (unitedItem) => unitedItem.guid === item
                            )?.name
                        )
                        .join(', ') ?? '')
                    ) : (
                      <Badge variant="secondary">Нет данных</Badge>
                    )}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-medium">Год создания</Label>
                    <p>
                      {data?.yearCreate ? (
                        data.yearCreate
                      ) : (
                        <Badge variant="secondary">Нет данных</Badge>
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="font-medium">Система координат</Label>
                    <p>
                      {baseDictionary?.coordinateSystems?.find(
                        (item) => item?.id == data?.coordSystemId
                      )?.name ?? <Badge variant="secondary">Нет данных</Badge>}
                    </p>
                  </div>
                  <div>
                    <Label className="font-medium">Масштаб</Label>
                    <p>
                      {data?.scale ? (
                        `1 : ${data.scale}`
                      ) : (
                        <Badge variant="secondary">Нет данных</Badge>
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="font-medium">Формат хранения</Label>
                    <p>
                      {data?.formats && data?.formats.length > 0 ? (
                        data?.formats!.join(', ')
                      ) : (
                        <Badge variant="secondary">Нет данных</Badge>
                      )}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="font-medium">Секретность</Label>
                  <p>
                    {baseDictionary?.secretStatusTypes?.find(
                      (item) => item?.id === data?.secretStatus
                    )?.name ?? <Badge variant="secondary">Нет данных</Badge>}
                  </p>
                </div>
                <div>
                  <Label className="font-medium">
                    Организация-изготовитель
                  </Label>
                  <p>
                    {baseDictionary?.materialcreator?.find(
                      (item) => item?.id == data?.materialCreatorId
                    )?.name ?? <Badge variant="secondary">Нет данных</Badge>}
                  </p>
                </div>
                <div>
                  <Label className="font-medium">Правообладатель</Label>
                  <p>
                    {data?.mapOwner ?? (
                      <Badge variant="secondary">Нет данных</Badge>
                    )}
                  </p>
                </div>
                <div>
                  <Label className="font-medium">
                    Год соответствия местности
                  </Label>
                  <p>
                    {data?.yearConformity ?? (
                      <Badge variant="secondary">Нет данных</Badge>
                    )}
                  </p>
                </div>
                <div>
                  <Label className="font-medium">Условия доступа</Label>
                  <p>
                    {data?.accessConditions ?? (
                      <Badge variant="secondary">Нет данных</Badge>
                    )}
                  </p>
                </div>
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
                    geometry={data?.geometryString ?? ''}
                  />
                </div>
              </CardContent>
            </Card>

            <SpatialImages
              repoAttachedFiles={data?.repoFiles?.repoAttachedFiles}
              attachedFilesList={data?.attachedFilesList}
              onClickImage={(file) => setExpandedImage(file)}
            />

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Файлы пространственных данных</CardTitle>
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
            <a onClick={() => history.back()}>
              <Button variant="outline">
                <ArrowLeft className="mr-2" size={16} />
                Назад к каталогу
              </Button>
            </a>
            <div className="flex space-x-4">
              <a href={cartHref()} className="cursor-pointer">
                <Button className="relative" variant="outline">
                  В заявлении
                  {!!cartCount && (
                    <Badge className="absolute -right-2 -top-2">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </a>
              <Button
                className="flex gap-2"
                onClick={addToCart}
                disabled={!isLoaded || adding}
              >
                {adding ? (
                  <>
                    Добавление{' '}
                    <LoaderCircle className="h-4 w-4 animate-spin duration-500" />
                  </>
                ) : (
                  'Добавить в заявление'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={errorModal.isShow} onOpenChange={handleToggleErrorModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{errorModal.title}</DialogTitle>
            <DialogDescription>{errorModal.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => history.back()}>Вернуться к списку</Button>
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
    </>
  );
}
