import { useState } from 'react';

export interface ColorOption {
  colorId: string;
  colorName: string;
  colorHexCode?: string;
  inStock: boolean;
  stock: number;
}

export interface UseColorSelectionProps {
  colors: ColorOption[];
  onChange?: (color: ColorOption | null) => void;
}

export function useColorSelection({ colors, onChange }: UseColorSelectionProps) {
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(
    colors.find((c) => c.inStock) || null
  );

  const handleColorSelect = (color: ColorOption) => {
    if (!color.inStock) return;
    setSelectedColor(color);
    if (onChange) onChange(color);
  };

  const getAvailableStock = () => {
    return selectedColor?.stock || 0;
  };

  return {
    selectedColor,
    handleColorSelect,
    getAvailableStock,
  };
}
