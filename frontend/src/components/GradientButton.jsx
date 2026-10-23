function GradientButton({
  children,
  onClick,
  disabled = false,
  className = ""
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
      w-full
      py-4
      rounded-2xl
      font-semibold
      text-white

      bg-gradient-to-r
      from-blue-600
      via-cyan-500
      to-blue-600

      hover:scale-105
      hover:shadow-xl
      hover:shadow-cyan-500/40

      active:scale-95

      transition-all
      duration-300

      disabled:opacity-50
      disabled:cursor-not-allowed

      ${className}
      `}
    >
      {children}
    </button>
  );
}

export default GradientButton;