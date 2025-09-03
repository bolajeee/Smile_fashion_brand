export type CheckboxType = {
  type?: string;
  label: string;
  name: string;
  checked: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export interface CheckboxColorType {
  valueName: string;
  color: string;
  name: string;
  isChecked: boolean;
  onChange: (checked: boolean) => void;
}

const Checkbox = ({ type = "", label, name, onChange }: CheckboxType) => (
  <label
    htmlFor={`${label}-${name}`}
    className={`checkbox ${type ? `checkbox--${type}` : ""}`}
  >
    <input
      name={name}
      onChange={onChange}
      type="checkbox"
      id={`${label}-${name}`}
    />
    <span className="checkbox__check" />
    <p>{label}</p>
  </label>
);

export default Checkbox;
