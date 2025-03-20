import { ChangeEventHandler } from 'react';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface TextareaItemProps {
  label: string;
  value: string | undefined;
  placeholder: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  readOnly?: boolean;
  required?: boolean;
}

const TextareaItem = ({
  label,
  placeholder,
  value,
  onChange,
  readOnly,
  required
}: TextareaItemProps) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Label
        className="col-span-1 font-medium"
        title={required ? 'Поле обязательно для заполнения' : ''}
      >
        {label}
        {required && <span className="font-bold text-purple-500">*</span>}
      </Label>
      <Textarea
        className="col-span-2"
        readOnly={readOnly}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      ></Textarea>
    </div>
  );
};

export default TextareaItem;
