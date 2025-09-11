export interface ColorOption {
  name: string;
  value: string;
  hex: string;
}

export const COLORS: ColorOption[] = [
  { name: 'White', value: 'white', hex: '#ffffff' },
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'Blue', value: 'blue', hex: '#1976d2' },
  { name: 'Teal', value: 'teal', hex: '#14b8a6' },
  { name: 'Red', value: 'red', hex: '#d32f2f' },
  { name: 'Green', value: 'green', hex: '#388e3c' },
];

export const COLOR_MAP = new Map(COLORS.map(c => [c.value, c]));

export const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL'];