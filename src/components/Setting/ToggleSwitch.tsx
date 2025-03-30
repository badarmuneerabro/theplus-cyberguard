import React from 'react';

interface ToggleSwitchProps {
  label: string;
  isOn: boolean;
  onToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, isOn, onToggle }) => {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0" }}>
        <span style={{ color: "#D1D5DB" }}>{label}</span>
        <button
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            height: "24px",
            borderRadius: "9999px",
            width: "44px",
            transition: "background-color 0.2s",
            outline: "none",
            backgroundColor: isOn ? "#4F46E5" : "#4B5563",
          }}
          onClick={onToggle}
          aria-checked={isOn}
          role="switch"
          aria-label={label}
        >
          <span
            style={{
              width: "16px",
              height: "16px",
              transform: isOn ? "translateX(22px)" : "translateX(4px)",
              transition: "transform 0.2s",
              backgroundColor: "#FFFFFF",
              borderRadius: "9999px",
            }}
          />
        </button>
      </div>
    );
  };

export default ToggleSwitch;
