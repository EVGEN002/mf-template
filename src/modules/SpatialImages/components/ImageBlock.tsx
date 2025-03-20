import { Button } from '@/components/ui/button';

import { Trash2 } from 'lucide-react';

interface ImageBlockProps {
  onClickImage?: () => void;
  onClickDelete?: () => void;
  imageRenderFunction: () => string;
  alt: string;
}

const ImageBlock = ({
  onClickImage,
  onClickDelete,
  imageRenderFunction,
  alt
}: ImageBlockProps) => {
  return (
    <div
      className="group relative h-[100px] w-[100px] cursor-pointer overflow-hidden rounded-md"
      onClick={onClickImage}
    >
      {onClickDelete && (
        <Button
          className="absolute right-1 top-1 h-7 w-7 opacity-0 transition-all group-hover:opacity-100"
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onClickDelete();
          }}
        >
          <Trash2 className="h-3 w-3 text-red-500" />
        </Button>
      )}
      <img
        className="h-full w-full object-cover"
        src={imageRenderFunction()}
        alt={alt}
      />
    </div>
  );
};

export default ImageBlock;
