export function TextoGradeClamp({ children, title = '' }) {
  const texto = typeof children === 'string' ? children : '';
  const titulo = title || texto;

  return (
    <span className="textoGradeClamp" title={titulo}>
      {children}
    </span>
  );
}
