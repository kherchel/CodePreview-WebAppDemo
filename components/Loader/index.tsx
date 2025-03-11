import "./styles.scss";

const Loader = ({
  fill,
  small,
  white,
}: {
  fill?: boolean;
  small?: boolean;
  white?: boolean;
}) =>
  fill ? (
    <div className="loader-container">
      <span className="loader" />
    </div>
  ) : (
    <span className={`loader ${small && "small"} ${white && "white"}`} />
  );

export default Loader;
