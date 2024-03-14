interface FlyingBabyAnimationProps {
  height?: string;
  width?: string;
  className?: string;
}

export const RobotAnimation = ({ height, width, className }: FlyingBabyAnimationProps) => {
  return (
    <div className={className}>
      <iframe
        height={height}
        width={width}
        style={{ border: 'none' }}
        src="https://rive.app/community/3061-6472-character-rig/embed"
        allowFullScreen
      />
    </div>
  );
};
