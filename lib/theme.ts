import { createBreakpoints } from '@chakra-ui/theme-tools';
import { extendTheme, createStandaloneToast } from '@chakra-ui/react';

const breakpoints = createBreakpoints({
  sm: '30em',
  md: '48em',
  lg: '62em',
  xl: '83em',
  mobile: '0',
  desktop: '860px',
});

export const theme = extendTheme(
  {
    styles: {
      global: {
        'div#root': {
          height: '100%',
          overflow: 'hidden',
        },
        'html, body': {
          height: '100%',
          width: '100%',
        },
      },
    },
    colors: {
      lightGrey: '#E8EFF6',
      indigo: '#0206A8',
      navy: '#00083D',
      yellow: '#E7E710',
      grey: '#7B8191',
      lightBlue: '#00E2EA',
      blue: {
        500: '#0206A8'
      }
    },
    components: {
      Heading: {
        baseStyle:{
          color: "gray.700",
        },
        defaultProps: {
          size: "lg"
        }
      },
      Text:{
        baseStyle:{
          color: "gray.600",
          fontWeight: "medium"
        },
      },
    },
  },
);