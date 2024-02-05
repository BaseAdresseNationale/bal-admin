interface AutocompleteInputProps {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  onChange: (e: any) => void;
  value?: string;
  hint?: string;
  isDisabled?: boolean;
  placeholder?: string;
  onSelect?: (e: any) => void;
}

const AutocompleteInput = ({
  id,
  label,
  options,
  onChange,
  value = "",
  hint = null,
  isDisabled = false,
  placeholder = "",
  onSelect = null,
}: AutocompleteInputProps) => (
  <div
    className={`${onSelect ? "fr-search-bar" : "fr-input-group"} ${
      isDisabled ? "fr-select-input--disabled" : ""
    }`}
  >
    <label className="fr-label" htmlFor={`input-${label}`}>
      {label}
      {hint && <span className="fr-hint-text">{hint}</span>}
    </label>

    <input
      className="fr-input"
      list={"browsers#" + id}
      id={`input-${label}`}
      name={`input-${label}`}
      value={value}
      disabled={isDisabled}
      placeholder={placeholder}
      onChange={(event) => onChange(event)}
    />
    {onSelect && (
      <button
        className="fr-btn"
        type="button"
        title="Rechercher"
        onClick={(event) => onSelect(event)}
      >
        Rechercher
      </button>
    )}
    <datalist id={"browsers#" + id}>
      {options.map((option, idx) => (
        <option key={idx} value={option.value}>
          {option.label}
        </option>
      ))}
    </datalist>
  </div>
);

export default AutocompleteInput;
