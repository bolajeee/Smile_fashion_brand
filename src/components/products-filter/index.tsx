import Slider from "rc-slider";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";
import Checkbox from "./form-builder/checkbox";

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);


interface ProductsFilterProps {
  selectedFilters: {
    type?: string;
    price?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

type FilterCategories = {
  type: string[];
  price: number[];
  [key: string]: string[] | number[];
};

const ProductsFilter = ({ selectedFilters }: ProductsFilterProps) => {
  const router = useRouter();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterCategories>({
    type: Array.isArray(selectedFilters.type)
      ? selectedFilters.type
      : selectedFilters.type?.split(",") || [],
    price:
      (selectedFilters.minPrice && selectedFilters.maxPrice)
        ? [Number(selectedFilters.minPrice), Number(selectedFilters.maxPrice)]
        : selectedFilters.price?.split("-").map(Number) || [0, 50000],
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

    const query: { [key: string]: string | string[] } = {};

    if (activeFilters.type.length) {
      query["type"] = activeFilters.type;
    }
    if (activeFilters.price?.length === 2) {
      query["minPrice"] = String(activeFilters.price[0]);
      query["maxPrice"] = String(activeFilters.price[1]);
    }

    router.push({
      pathname: router.pathname,
      query,
    }, undefined, { shallow: true }).then(() => {
      setFiltersOpen(false);
    });
  };

  const clearFilters = () => {
    setActiveFilters({
      type: [],
      price: [0, 50000],
    });
    // Remove all filter query params to show all products
    router.push({ pathname: router.pathname, query: {} }, undefined, { shallow: true });
  };

  return (
    <form className="products-filter" onSubmit={applyFilters}>
      <button
        type="button"
        onClick={() => setFiltersOpen(!filtersOpen)}
        className={`products-filter__menu-btn ${filtersOpen ? "products-filter__menu-btn--active" : ""}`}
        aria-expanded={filtersOpen}
        aria-controls="filters-panel"
      >
        Add Filter <i className="icon-down-open" />
      </button>

      <AnimatePresence initial={false}>
        {filtersOpen && (
          <motion.div
            id="filters-panel"
            className="products-filter__wrapper products-filter__wrapper--open"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="products-filter__row">
              {/* Product Type Filter */}
              <div className="products-filter__block">
                <button type="button">Product type</button>
                <div className="products-filter__block__content">
                  {["Shirts", "Caps", "Bags"].map((type) => (
                    <Checkbox
                      key={type}
                      name="product-type"
                      label={type}
                      checked={activeFilters.type.includes(type)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateFilters("type", type, e.target.checked)
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="products-filter__block">
                <button type="button">Price Range</button>
                <div className="products-filter__block__content">
                  <div className="products-filter__range">
                    <Range
                      min={0}
                      max={50000}
                      value={activeFilters.price}
                      onChange={handlePriceChange}
                      tipFormatter={(value) => `$${value}`}
                      railStyle={{ backgroundColor: 'var(--color-border-light)' }}
                      trackStyle={[{ backgroundColor: 'var(--color-primary)' }]}
                      handleStyle={[
                        { borderColor: 'var(--color-primary)', backgroundColor: 'white' },
                        { borderColor: 'var(--color-primary)', backgroundColor: 'white' }
                      ]}
                    />
                    <div className="products-filter__range-inputs">
                      <input
                        type="number"
                        className="products-filter__range-input"
                        value={activeFilters.price[0]}
                        onChange={(e) => handlePriceChange([parseInt(e.target.value), activeFilters.price[1]])}
                        min={0}
                        max={activeFilters.price[1]}
                      />
                      <span className="products-filter__range-separator">-</span>
                      <input
                        type="number"
                        className="products-filter__range-input"
                        value={activeFilters.price[1]}
                        onChange={(e) => handlePriceChange([activeFilters.price[0], parseInt(e.target.value)])}
                        min={activeFilters.price[0]}
                        max={50000}
                      />
                    </div>
                  </div>
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
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

export default ProductsFilter;