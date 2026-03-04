const EmptyState = ({ title, description, action }) => (
  <div className="text-center py-16 px-6">
    <div className="w-16 h-16 bg-surface-3 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <svg className="w-8 h-8 text-tx-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-tx-primary mb-2">{title}</h3>
    <p className="text-sm text-tx-secondary mb-6 max-w-xs mx-auto">{description}</p>
    {action}
  </div>
);

export default EmptyState;