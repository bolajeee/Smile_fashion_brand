import { ThemeProvider as NextThemeProvider, ThemeProviderProps } from "next-themes";
import { ReactNode } from "react";

type ExtendedThemeProviderProps = ThemeProviderProps & {
  children: ReactNode;
};

export function ThemeProvider({ children, ...props }: ExtendedThemeProviderProps) {
  return (
    <NextThemeProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      {...props}
    >
      {children}
    </NextThemeProvider>
  );
}
