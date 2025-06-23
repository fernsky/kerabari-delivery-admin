import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterControlsProps {
  filterWard: string;
  setFilterWard: (value: string) => void;
  filterGender: string;
  setFilterGender: (value: string) => void;
  showAgeGrouping: boolean;
  setShowAgeGrouping: (value: boolean) => void;
  uniqueWards: number[];
}

export function FilterControls({
  filterWard,
  setFilterWard,
  filterGender,
  setFilterGender,
  showAgeGrouping,
  setShowAgeGrouping,
  uniqueWards,
}: FilterControlsProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <div className="flex items-center space-x-2">
        <label htmlFor="ward-filter" className="text-sm whitespace-nowrap">
          वडा अनुसार फिल्टर:
        </label>
        <Select value={filterWard} onValueChange={setFilterWard}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="सबै वडाहरू" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">सबै वडाहरू</SelectItem>
            {uniqueWards.map((ward) => (
              <SelectItem key={ward} value={ward.toString()}>
                वडा {ward}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <label htmlFor="gender-filter" className="text-sm whitespace-nowrap">
          लिङ्ग अनुसार फिल्टर:
        </label>
        <Select value={filterGender} onValueChange={setFilterGender}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="सबै लिङ्ग" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">सबै लिङ्ग</SelectItem>
            <SelectItem value="MALE">पुरुष</SelectItem>
            <SelectItem value="FEMALE">महिला</SelectItem>
            <SelectItem value="OTHER">अन्य</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <label className="text-sm whitespace-nowrap">उमेर समूह:</label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAgeGrouping(!showAgeGrouping)}
        >
          {showAgeGrouping ? "श्रेणी बन्द गर्नुहोस्" : "श्रेणीहरू देखाउनुहोस्"}
        </Button>
      </div>
    </div>
  );
}
