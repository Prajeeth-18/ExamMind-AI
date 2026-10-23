function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`
      bg-slate-900/80
      backdrop-blur-xl
      border
      border-slate-700
      rounded-3xl
      shadow-2xl
      shadow-blue-500/10
      transition-all
      duration-500
      hover:border-blue-500
      hover:shadow-blue-500/20
      ${className}
      `}
    >
      {children}
    </div>
  );
}

export default GlassCard;