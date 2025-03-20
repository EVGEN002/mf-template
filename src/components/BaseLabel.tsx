import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';

interface BaseLabelProps {
  label: string;
  children: ReactNode;
  required?: boolean;
}

const BaseLabel = ({ label, children, required }: BaseLabelProps) => {
  return (
    <div className='grid grid-cols-3 gap-2'>
      <Label className='col-span-1' title={required ? 'Поле обязательно для заполнения' : ''}>{label}{required && <span className='text-purple-500 font-bold'>*</span>}</Label>
      <div className='col-span-2'>
        {children}
      </div>
    </div>
  );
};

export default BaseLabel;
