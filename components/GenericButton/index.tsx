import Loader from "../Loader";
import "./styles.scss";

interface GenericButtonProps {
  label: string;
  icon?: string;
  disabled?: boolean;
  onClick?: () => void;
  withGlow?: boolean;
  visibleDisabled?: boolean;
  style?: React.CSSProperties;
  loading?: boolean;
  whiteLoading?: boolean;
  rounder?: boolean;
}

const GenericButton = ({
  label,
  icon,
  disabled,
  onClick,
  withGlow,
  visibleDisabled,
  style,
  loading,
  whiteLoading,
  rounder,
}: GenericButtonProps) => (
  <div
    className={`generic-button ${disabled && "disabled"} ${
      withGlow && "withGlow"
    } ${visibleDisabled && "visibleDisabled"} ${loading && "loading"} ${
      rounder && "rounder"
    }`}
    onClick={disabled || loading ? () => {} : onClick}
    style={style}
  >
    {icon && <img src={icon} alt="Icon" className="icon" />}
    {!loading && <div className="label">{label}</div>}
    {loading && <Loader small white={whiteLoading} />}
  </div>
);

export default GenericButton;
