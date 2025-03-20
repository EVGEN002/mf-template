import { ChangeEventHandler } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';

interface BaseItemProps {
  label: string;
  value: string | undefined | null;
  onChange: ChangeEventHandler<HTMLInputElement>;
  className?: string;
  readOnly?: boolean;
  required?: boolean;
}

const BaseItem = ({
  label,
  value,
  onChange,
  className,
  readOnly,
  required
}: BaseItemProps) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Label className="col-span-1 font-medium" title={required ? 'Поле обязательно для заполнения' : ''}>
        {label}
        {required && <span className="font-bold text-purple-500">*</span>}
      </Label>
      <Input
        className={cn('col-span-2', className)}
        readOnly={readOnly}
        type="text"
        value={value ?? ''}
        onChange={onChange}
      ></Input>
    </div>
  );
};

export default BaseItem;
