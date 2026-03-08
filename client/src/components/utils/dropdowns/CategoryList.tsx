import { useEffect, useState } from "react";
import Select from "react-select";
import { useAppSelector } from "../../../redux/hooks";
import { categoryApi } from "../../../services/ecommerceApi";
import type { CategoryResponseDto } from "../../../services/apiTypes";

type Option = { value: string; label: string };

const CategoryList = () => {
  const [category, setCategory] = useState<Option | null>(null);
  const [options, setOptions] = useState<Option[]>([{ value: "", label: "Tüm kategoriler" }]);
  const darkMode = useAppSelector((state) => state.theme.isDark);

  useEffect(() => {
    categoryApi
      .getAll()
      .then((data) => {
        setOptions([
          { value: "", label: "Tüm kategoriler" },
          ...data.map((c) => ({ value: c.id, label: c.name ?? c.id })),
        ]);
      })
      .catch(() => {});
  }, []);

  return (
    <Select
      options={options}
      value={category}
      className="ar-select"
      placeholder="Tüm kategoriler"
      onChange={(selectedOption) => setCategory(selectedOption as Option)}
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          backgroundColor: "transparent",
          color: darkMode ? "#c4c4c4" : "#222222",
          fontSize: 14,
          borderColor: darkMode ? "rgba(255, 255, 255, 0.12)" : "#dbeaea",
        }),
      }}
    />
  );
};
export default CategoryList;
