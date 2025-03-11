import "./styles.scss";

interface LabeledInputProps {
  label: string | React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "password";
  disabled?: boolean;
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  placeholder?: string;
  multiline?: boolean;
  error?: boolean;
}

const LabeledInput = ({
  label,
  value,
  onChange,
  type,
  disabled,
  style,
  inputStyle,
  placeholder,
  multiline,
  error,
}: LabeledInputProps) => (
  <div className={`labeled-input ${error && "error"}`} style={style}>
    <div className="label">{label}</div>
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={inputStyle}
        placeholder={placeholder}
      />
    ) : (
      <input
        type={type || "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={inputStyle}
        placeholder={placeholder}
      />
    )}
  </div>
);

export default LabeledInput;
