import "./styles.scss";

interface RedBoxProps {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  children: React.ReactNode;
  collapsed?: boolean;
  centered?: boolean;
  narrower?: boolean;
  headerStyle?: React.CSSProperties;
}

const RedBox = ({
  title,
  subtitle,
  leftAction,
  rightAction,
  children,
  collapsed,
  centered,
  narrower,
  headerStyle,
}: RedBoxProps) => (
  <div className="red-box">
    <div
      className={`red-box-header ${centered && "centered"} ${
        narrower && "narrower"
      }`}
      style={headerStyle}
    >
      {leftAction}
      <div className="red-box-title">{title}</div>
      {subtitle && <div className="red-box-subtitle">{subtitle}</div>}
      {rightAction}
    </div>
    <div className={`red-box-content ${collapsed && "collapsed"}`}>
      {children}
    </div>
  </div>
);

export default RedBox;
