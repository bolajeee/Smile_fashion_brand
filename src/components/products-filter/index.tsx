
import Slider from "rc-slider";
import { useRouter } from "next/router";
import { useState } from "react";
import type { ProductColor, ProductSize, ProductType } from "@/types/product";
import Checkbox from "./form-builder/checkbox";
import CheckboxColor from "./form-builder/checkbox-color";

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

interface ProductsFilterProps {
  productTypes: ProductType[];
  productSizes: ProductSize[];
  productColors: ProductColor[];
  selectedFilters: {
    type?: string;
    price?: string;
    size?: string;
    color?: string;
  };
}

type FilterCategories = {
  type: string[];
  size: string[];
  color: string[];
  price: number[];
  [key: string]: string[] | number[]; // Add index signature
};

const ProductsFilter = ({
  productTypes,
  productSizes,
  productColors,
  selectedFilters,
}: ProductsFilterProps) => {
  const router = useRouter();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterCategories>({
    type: selectedFilters.type?.split(",") || [],
    size: selectedFilters.size?.split(",") || [],
    color: selectedFilters.color?.split(",") || [],
    price: selectedFilters.price?.split("-").map(Number) || [0, 500],
  });

  const updateFilters = (
    category: keyof FilterCategories,
    value: string,
    checked: boolean
  ) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };
      const categoryArray = newFilters[category] as string[];
      if (checked) {
        newFilters[category] = [...categoryArray, value];
      } else {
        newFilters[category] = categoryArray.filter((item) => item !== value);
      }
      return newFilters;
    });
  };

  const handlePriceChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setActiveFilters((prev) => ({
        ...prev,
        price: value,
      }));
    }
  };

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();

    const query: { [key: string]: string } = {};

    if (activeFilters.type.length) {
      query["type"] = activeFilters.type.join(",");
    }

    if (activeFilters.size.length) {
      query["size"] = activeFilters.size.join(",");
    }

    if (activeFilters.color.length) {
      query["color"] = activeFilters.color.join(",");
    }

    if (activeFilters.price?.length === 2) {
      query["price"] = activeFilters.price.join("-");
    }

    router.push({
      pathname: router.pathname,
      query,
    });
  };

  const clearFilters = () => {
    setActiveFilters({
      type: [],
      size: [],
      color: [],
      price: [0, 500],
    });
    router.push(router.pathname);
  };

  return (
    <form className="products-filter" onSubmit={applyFilters}>
      <button
        type="button"
        onClick={() => setFiltersOpen(!filtersOpen)}
        className={`products-filter__menu-btn ${
          filtersOpen ? "products-filter__menu-btn--active" : ""
        }`}
      >
        Add Filter <i className="icon-down-open" />
      </button>

      <div
        className={`products-filter__wrapper ${
          filtersOpen ? "products-filter__wrapper--open" : ""
        }`}
      >
        {/* Product Type Filter */}
      <div className="products-filter__block">
        <button type="button">Product type</button>
        <div className="products-filter__block__content">
          {productTypes.map((type) => (
            <Checkbox
              key={type.id}
              name="product-type"
              label={type.name}
              checked={activeFilters.type.includes(type.name)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFilters("type", type.name, e.target.checked)
              }
            />
          ))}
        </div>
      </div>

        {/* Price Range Filter */}
        {/* <div className="products-filter__block">
          <button type="button">Price</button>
          <div className="products-filter__block__content">
            <Range
              min={0}
              max={500}
              value={activeFilters.price}
              onChange={handlePriceChange}
              tipFormatter={(value) => `$${value}`}
            />
          </div>
        </div> */}

        {/* Size Filter */}
        <div className="products-filter__block">
          <button type="button">Size</button>
          <div className="products-filter__block__content checkbox-square-wrapper">
            {productSizes.map((size) => (
              <Checkbox
                type="square"
                key={size.id}
                name="product-size"
                label={size.label}
                checked={activeFilters.size.includes(size.label)}
                onChange={(e) =>
                  updateFilters("size", size.label, e.target.checked)
                }
              />
            ))}
          </div>
        </div>

        {/* Color Filter */}
        <div className="products-filter__block">
        <button type="button">Color</button>
        <div className="products-filter__block__content">
          <div className="checkbox-color-wrapper">
            {productColors.map((type) => (
              <CheckboxColor
                key={type.id}
                valueName={type.color}
                name="product-color"
                color={type.color}
                isChecked={activeFilters.color.includes(type.color)}
                onChange={(checked: boolean) =>
                  updateFilters("color", type.color, checked)
                }
              />
            ))}
          </div>
        </div>
      </div>

        <div className="products-filter__buttons">
          <button
            type="submit"
            className="btn btn-submit btn--rounded btn--yellow"
          >
            Apply Filters
          </button>
          <button
            type="button"
            className="btn btn-submit btn--rounded btn--gray"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductsFilter;
