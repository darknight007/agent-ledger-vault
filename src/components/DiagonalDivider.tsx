export const DiagonalDivider = () => {
  return (
    <div className="relative h-24 w-full overflow-hidden">
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'linear-gradient(135deg, hsl(222, 65%, 18%) 0%, hsl(222, 65%, 18%) 48%, hsl(210, 20%, 98%) 52%, hsl(210, 20%, 98%) 100%)',
        }}
      />
    </div>
  );
};
