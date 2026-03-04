const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-sm text-red-400">{message}</p>
    </div>
    {onRetry && (
      <button onClick={onRetry} className="text-xs text-red-400 font-medium underline ml-4 hover:text-red-300">
        Retry
      </button>
    )}
  </div>
);

export default ErrorMessage;