import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImageBlock from './components/ImageBlock';

import { cn } from '@/lib/utils';

import returnRepoSrc from '@/helpers/returnRepoSrc';

import { AttachedFile, RepoFile } from '@/types/spatialData';
import returnFileSrcFromPath from '@/helpers/returnFileSrcFromPath';
import { Fragment } from 'react/jsx-runtime';

interface SpatialImagesProps {
  className?: string;
  repoAttachedFiles: RepoFile[] | null | undefined;
  attachedFilesList: AttachedFile[] | null | undefined;
  onClickDownLoad?: () => void;
  onClickImage: (file: RepoFile | AttachedFile) => void;
  onClickDelete?: (file: RepoFile | AttachedFile) => void;
}

const SpatialImages = ({
  className,
  repoAttachedFiles,
  attachedFilesList,
  onClickDownLoad,
  onClickImage,
  onClickDelete
}: SpatialImagesProps) => {
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Изображения предпросмотра пространственных данных</CardTitle>
        {onClickDownLoad && (
          <Button size="sm" variant="outline" onClick={onClickDownLoad}>
            Загрузить изображение
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {[...(repoAttachedFiles || []), ...(attachedFilesList || [])].length >
          0
            ? [...(repoAttachedFiles || []), ...(attachedFilesList || [])].map(
                (file, index) => (
                  <ImageBlock
                    key={index}
                    imageRenderFunction={() =>
                      'code' in file
                        ? returnRepoSrc(file.code)
                        : returnFileSrcFromPath(file.path)
                    }
                    onClickImage={
                      onClickImage ? () => onClickImage(file) : undefined
                    }
                    onClickDelete={
                      onClickDelete ? () => onClickDelete(file) : undefined
                    }
                    alt={file.name ?? ''}
                  />
                )
              )
            : ''}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpatialImages;
