import Image from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const Logo = ({ width = 120, height = 40, className = '' }: LogoProps) => {
  const { theme } = useTheme();
  
  return (
    <div className={`logo ${className}`}>
      <Image
        src={theme === 'dark' ? '/images/logos/smile-logo-dark.jpg' : '/images/logos/smile-logo-light.jpg'}
        alt="Smile"
        width={width}
        height={height}
        priority
        className="logo__image"
      />
    </div>
  );
};
