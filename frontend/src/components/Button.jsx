const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled,
  className = "",
}) => {
  const base =
    "inline-flex items-center justify-center px-4 py-2 rounded-lg font-body font-medium text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface";

  const variants = {
    primary:
      "bg-primary text-surface hover:bg-primary-dark focus:ring-primary glow",
    secondary:
      "bg-surface-2 text-tx-primary border border-bdr hover:bg-surface-3 focus:ring-surface-3",
    danger:
      "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 focus:ring-red-500",
    ghost:
      "bg-transparent text-tx-secondary hover:text-tx-primary hover:bg-surface-2 focus:ring-surface-3",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;