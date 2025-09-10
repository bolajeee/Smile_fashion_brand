// import Image from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';

const lightLogo = '/images/logos/smile_logo_light.jpg';
const darkLogo = '/images/logos/smile_logo_dark.jpg'; 

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const Logo = ({ width = 120, height = 40, className = '' }: LogoProps) => {
  const { theme } = useTheme();
  
  return (
    <div className={`logo ${className}`}>
      <img
        src={theme === 'dark' ? darkLogo : lightLogo}
        alt="Smile"
        width={width}
        height={height}
        className="logo__image"
        loading="eager"
        decoding="async"
        style={{ display: 'block' }}
      />
    </div>
  );
};
