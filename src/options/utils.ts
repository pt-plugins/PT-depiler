import { useBreakpoints, useDark, useToggle } from "@vueuse/core";

export function openUrl (url:string | URL, target: string = "_blank", features?: string) {
  return window.open(url, target, features);
}

// Breakpoints from https://www.naiveui.com/zh-CN/light/components/config-provider#API
export const breakpoints = useBreakpoints({
  xs: 0, s: 640, m: 1024, l: 1280, xl: 1536, xxl: 1920
});

export const isMobile = breakpoints.smaller("s");
export const isTablet = breakpoints.smaller("m");
export const isSmallDesktop = breakpoints.smaller("l");

export const isDark = useDark();
export const toggleDark = useToggle(isDark);
