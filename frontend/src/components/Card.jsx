const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-surface-2 border border-bdr rounded-xl p-6 transition-all duration-200 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;