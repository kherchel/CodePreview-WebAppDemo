import { useEffect, useState } from "react";
import { useGuilds } from "../../contexts/guilds";
import { usePlatforms } from "../../contexts/platforms";
import Checkbox from "../Checkbox";

import "./styles.scss";
import Select from "react-dropdown-select";
import { useLanguages } from "../../contexts/languages";
import DropdownSelect from "../DropdownSelect";
import GenericButton from "../GenericButton";

const FilterModal = ({ onClose }: { onClose?: () => void }) => {
  const platforms = usePlatforms();
  const guilds = useGuilds();
  const languages = useLanguages();

  const [platform, setPlatform] = useState<string | null>(null);
  const [language, setLanguage] = useState<string | null>(null);

  useEffect(() => {
    const filters = guilds.filters;
    setPlatform(filters.platform);
    setLanguage(filters.language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClear = () => {
    setPlatform(null);
    setLanguage(null);
    onConfirm(true);
  };

  const onConfirm = (noClose?: boolean) => {
    console.log("onConfirm", platform, language);
    guilds.updateFilters({
      platform,
      language,
    });
    if (!noClose) {
      onClose?.();
    }
  };

  return (
    <div className="filter-modal-container">
      <div className="filter-modal">
        <div className="header">Filters</div>
        <div className="content">
          <div className="f-label">Platform</div>
          <div className="platforms">
            {platforms.platforms.map((p) => (
              <div
                className={`platform ${
                  p.id === platform ? "enabled" : "disabled"
                }`}
                onClick={() => setPlatform(p.id)}
                key={p.id}
              >
                <Checkbox
                  label={
                    <div className="checkbox-label">
                      <img
                        src={p.icon}
                        alt={p.name}
                        className="platform-icon"
                      />
                      <span className="platform-name">{p.name}</span>
                    </div>
                  }
                  checked={p.id === platform}
                  onChange={() => setPlatform(p.id)}
                  variant="circle"
                />
              </div>
            ))}
          </div>
          <div className="f-label margined">Language</div>
          <DropdownSelect
            options={languages.languages.map((l) => ({ label: l, value: l }))}
            onChange={(values) => setLanguage(values[0]?.value || null)}
            values={language ? [{ label: language, value: language }] : []}
          />
          <div className="row">
            <GenericButton
              label="OK"
              style={{ backgroundColor: "#e72313" }}
              onClick={() => onConfirm()}
            />
            <GenericButton label="Clear" withGlow onClick={onClear} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
