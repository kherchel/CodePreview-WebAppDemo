import "./styles.scss";

interface CheckboxProps {
  label: string | React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  variant?: "circle" | "square";
}

const Checkbox = ({
  label,
  checked,
  onChange,
  variant = "square",
}: CheckboxProps) => (
  <div className={`checkbox ${variant}`}>
    <div
      className={`check ${checked && "checked"}`}
      onClick={() => onChange(!checked)}
    >
      <div className="check-inner" />
    </div>
    <div className="label">{label}</div>
  </div>
);

export default Checkbox;
