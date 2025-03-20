import { Skeleton } from '@/components/ui/skeleton';

const LayoutSkeleton = () => {
  return (
    <div className="grid h-full w-full p-[30px] grid-cols-2 gap-4">
      <Skeleton className="h-full"></Skeleton>
      <div className='space-y-4'>
        <Skeleton className="h-[600px]"></Skeleton>
        <Skeleton className="h-[200px]"></Skeleton>
        <Skeleton className="h-[200px]"></Skeleton>
      </div>
    </div>
  );
};

export default LayoutSkeleton;
