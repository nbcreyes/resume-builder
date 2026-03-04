const Spinner = ({ text = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <div className="w-10 h-10 border-2 border-surface-3 border-t-primary rounded-full animate-spin" />
    <p className="text-sm text-tx-secondary">{text}</p>
  </div>
);

export default Spinner;