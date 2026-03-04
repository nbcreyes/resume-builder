const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  className = "",
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={name} className="text-xs font-medium text-tx-secondary uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`bg-surface-2 border rounded-lg px-3 py-2.5 text-sm text-tx-primary placeholder-tx-secondary outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 ${
          error ? "border-red-500/50" : "border-bdr"
        } ${className}`}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
};

export default Input;