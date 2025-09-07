import React from 'react';

interface QuantityControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const QuantityControl: React.FC<QuantityControlProps> = ({ value, onChange, min = 1, max = 99 }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= min && val <= max) {
      onChange(val);
    }
  };

  return (
    <div className="quantity-control">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        -
      </button>
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        aria-label="Quantity"
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default QuantityControl;
