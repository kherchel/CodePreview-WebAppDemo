import "./styles.scss";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  underTitle?: React.ReactNode;
  underSubtitle?: React.ReactNode;
  thumbnail?: string;
  rightSection?: React.ReactNode;
  centered?: boolean;
}

const SectionHeader = (props: SectionHeaderProps) => (
  <div className={`section-header ${props.centered && "centered"}`}>
    <div className="section-header-left">
      <div className="top">
        {props.thumbnail && (
          <img src={props.thumbnail} alt={props.title} className="thumbnail" />
        )}
        <div className="info">
          <h1>{props.title}</h1>
          {props.underTitle}
        </div>
      </div>
      {props.subtitle && <div className="subtitle">{props.subtitle}</div>}
      {props.underSubtitle && (
        <div className="under-subtitle">{props.underSubtitle}</div>
      )}
    </div>
    {props.rightSection}
  </div>
);

export default SectionHeader;
