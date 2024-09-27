declare module 'flubber' {
    interface Options {
      maxSegmentLength?: number;
      single?: boolean;
      string?: boolean;
    }
  
    export function interpolate(
      fromShape: string | string[],
      toShape: string | string[],
      options?: Options
    ): (t: number) => string;
  
    // Add other flubber functions if needed
  }
  