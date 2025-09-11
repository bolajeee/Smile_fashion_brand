const COLORS = {
  white: '#ffffff',
  black: '#000000',
  blue: '#1B2B65',
  teal: '#14b8a6',
  red: '#DC2626',
  green: '#059669',
};
const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL'];

type ColorOption = {
  name: string;
  value: string;
};

type ProductOptionsProps = {
  selectedColor: string;
  selectedSize: string;
  onColorSelect: (color: string) => void;
  onSizeSelect: (size: string) => void;
  colors?: ColorOption[];
  sizes?: string[];
};

export const ProductOptions = ({ 
  selectedColor,
  selectedSize,
  onColorSelect,
  onSizeSelect,
  colors = Object.entries(COLORS).map(([name, value]) => ({ name, value })),
  sizes = DEFAULT_SIZES
}: ProductOptionsProps) => {
  return (
    <div className="product-options">
      <div className="product-options__section">
        <h3 className="product-options__title">Color</h3>
        <div className="product-options__row">
          {colors.map((color) => (
            <button
              key={color.name}
              className={`color-option ${
                selectedColor === color.name ? 'color-option--selected' : ''
              }`}
              onClick={() => onColorSelect(color.name)}
              aria-label={`Select color ${color.name}`}
              data-color={color.name}
              style={{ backgroundColor: color.value }}
            />
          ))}
        </div>
      </div>

      <div className="product-options__section">
        <h3 className="product-options__title">Size</h3>
        <div className="product-options__row">
          {sizes.map((size) => (
            <button
              key={size}
              className={`size-option ${
                selectedSize === size ? 'size-option--selected' : ''
              }`}
              onClick={() => onSizeSelect(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
