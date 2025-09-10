type CheckboxColorType = {
  type?: string;
  name: string;
  color: string;
  valueName: string;
  isChecked: boolean;
  onChange?: (value: string) => void;
};

const CheckboxColor = ({
  color,
  name,
  type = "checkbox",
  onChange,
  valueName,
  isChecked,
}: CheckboxColorType) => {
  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dataName = e.target.getAttribute("data-name");
    if (onChange && dataName) {
      onChange(dataName);
    }
  };

  return (
    <label htmlFor={`${color}-${name}`} className="checkbox-color">
      <input
        onChange={onSelect}
        value={color}
        data-name={valueName}
        name={name}
        type={type}
        id={`${color}-${name}`}
        checked={isChecked}
      />
      <span className="checkbox__check">
        <span className="checkbox__color" style={{ backgroundColor: color }} />
      </span>
    </label>
  );
};

export default CheckboxColor;
