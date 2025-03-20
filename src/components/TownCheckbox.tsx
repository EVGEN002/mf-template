import { TownLocation } from '@/types/general';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

const TownCheckbox = ({
  town,
  selected,
  onToggle
}: {
  town: TownLocation;
  selected: TownLocation[];
  onToggle: (value: React.SetStateAction<TownLocation[]>) => void;
}) => {
  const isChecked = selected.some((sTown) => sTown.name === town.name);

  const handleCheckedChange = () => {
    onToggle((prev) =>
      isChecked
        ? prev.filter((item) => item.name !== town.name)
        : [...prev, town]
    );
  };

  return (
    <div className="flex items-start space-x-2">
      <Checkbox checked={isChecked} onCheckedChange={handleCheckedChange} />
      <Label>{town.name}</Label>
    </div>
  );
};

export default TownCheckbox;
