import { StyledIcon } from './styles';

type IconProps = {
  name: string;
  color?: string;
  size?: number;
  className?: string;
};

export const Icon = ({
  name,
  color = '#000000',
  className,
  size = 14,
}: IconProps) => {
  return (
    <StyledIcon
      className={[className, `material-symbols-rounded`].join(' ')}
      color={color}
      size={size}
    >
      {name}
    </StyledIcon>
  );
};
