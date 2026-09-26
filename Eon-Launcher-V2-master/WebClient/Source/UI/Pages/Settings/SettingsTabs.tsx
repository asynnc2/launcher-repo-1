import { LayoutGroup, motion } from "framer-motion";
import { PlayClick } from "../../../Core/Services/SoundEffects";
import { SettingsSections } from "../../../Core/Configuration/SettingsSections";
import type { SettingsTabsProps } from "../../../Types/Settings";

export function SettingsTabs({ ActiveTab, OnChange, IsGuest }: SettingsTabsProps) {
  const VisibleSections = SettingsSections.filter((Section) => !IsGuest || Section.Id !== "Mods");

  return (
    <LayoutGroup>
      <nav className="settings-tabs" aria-label="Settings sections">
        {VisibleSections.map((Section) => (
          <button
            key={Section.Id}
            className={`home-tab${ActiveTab === Section.Id ? " active" : ""}`}
            type="button"
            aria-current={ActiveTab === Section.Id ? "page" : undefined}
            onClick={() => { PlayClick(); OnChange(Section.Id); }}
          >
            {ActiveTab === Section.Id && (
              <motion.span layoutId="settings-tab-active" className="home-tab-active-bg" transition={{ type: "spring", stiffness: 520, damping: 38 }} />
            )}
            {Section.Label}
          </button>
        ))}
      </nav>
    </LayoutGroup>
  );
}