import { Filters } from "@/routes";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

type TableFiltersProps = {
  setFilters: (filters: Filters) => void;
  filters: Filters;
};

const OPTIONS: Option[] = [
  { label: "Active", value: "active" },
  { label: "Closed", value: "closed" },
  { label: "All", value: "" },
];

export const TableFilters = ({ setFilters, filters }: TableFiltersProps) => {
  const state = filters["filters.state"];
  return (
    <MultipleSelector
      defaultOptions={OPTIONS}
      placeholder="Filter by State"
      value={[{ label: state || "All", value: state ?? "" }]}
      onChange={(selected) =>
        setFilters({
          ...filters,
          "filters.state": selected[0].value as Filters["filters.state"],
        })
      }
      emptyIndicator={
        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
          לא נמצאו תוצאות
        </p>
      }
    />
  );
};
