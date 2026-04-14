const ToggleSwitch = ({ label, isOn, onToggle }) => {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-[#2C4964] font-medium">{label}</span>
      <button
        className={`
          relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300
          focus:outline-none ${isOn ? "bg-[#1977cc]" : "bg-gray-200"}
        `}
        onClick={onToggle}
      >
        <span
          className={`
            inline-block size-4 transform bg-white rounded-full shadow transition-transform duration-300
            ${isOn ? "translate-x-6" : "translate-x-1"}
          `}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
