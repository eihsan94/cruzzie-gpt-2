interface FlyingBabyAnimationProps {
  height?: string;
  width?: string;
  className?: string;
}

export const FlyingBabyAnimation = ({ height, width, className }: FlyingBabyAnimationProps) => {
  return (
    <div className={className}>
      <iframe
        height={height}
        width={width}
        style={{ border: 'none' }}
        src="https://rive.app/community/3218-6835-plant-parent/embed"
        allowFullScreen
      />
    </div>
  );
};
