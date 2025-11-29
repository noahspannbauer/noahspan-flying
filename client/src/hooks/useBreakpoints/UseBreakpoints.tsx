import { useEffect, useState } from 'react';
import { ScreenSize } from '../../enums/screenSize';

export const useBreakpoints = () => {
  const [screenSize, setScreenSize] = useState<ScreenSize>();
  const windowWidth = window.innerWidth;

  const getWindowSize = (width: number): ScreenSize => {
    let size!: ScreenSize;

    switch (true) {
      case width < 640: {
        size = ScreenSize.SM;

        break;
      }
      case width >= 640: {
        size = ScreenSize.MD;

        break;
      }
      case width >= 1024: {
        size = ScreenSize.LG

        break;
      }
      case width >= 1280: {
        size = ScreenSize.XL;

        break;
      }
      case width >= 1536: {
        size = ScreenSize.XXL;

        break;
      }
    }

    return size;
  }

  const onWindowResize = () => {
    const width: number = window.innerWidth;
    const newScreenSize: ScreenSize = getWindowSize(width);

    setScreenSize(newScreenSize);
  }

  useEffect(() => {
    onWindowResize()

    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
    }
  }, [])

  return {
    screenSize
  }
}