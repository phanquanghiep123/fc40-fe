import { createMuiTheme } from '@material-ui/core/styles';
import { orange } from '@material-ui/core/colors';
import { fade } from '@material-ui/core/styles/colorManipulator';

// Customize theme
export default createMuiTheme({
  utils: {
    fade, // Độ trong suốt của màu
  },
  palette: {
    primary: {
      main: '#009c52', // green
    },
    secondary: {
      main: '#37474f', // header
    },
    background: {
      head: '#f4f5f7',
      default: '#e6eff8',
    },
    action: {
      disabled: '#78909c',
      selected: '#d3dfe9',
      activated: '#cfd3d5',
    },
    text: {
      primary: '#263238', // normal
      secondary: '#455a64', // title, text menu, text header
      disabled: '#648191',
    },
    common: {
      light: '#ee9801', // orange
    },
    notify: {
      info: '#43a5ee',
    },
    orange,
    color1: '#01a8ee', // Xanh nước biển
    color2: '#f57761', // Cam đỏ
    color3: '#de1129', // Đỏ
    color4: '#ff017e', // Hồng
    color5: '#01a8ee', // Hồng tím
    color6: '#6871c1', // Tím xanh
    color7: '#7551e8', // Tím
    color8: '#1458e9', // Xanh dương đậm
    transparency: 0.15, // Độ trong suốt, mặc định 15%
  },
  shade: {
    grey: '0 1px 3px #aaa',
    light: '0px 5px 5px 0px rgba(62, 57, 107, .07)',
    border: '1px solid rgba(224, 224, 224, 1)',
  },
  props: {
    MuiCardHeader: {
      titleTypographyProps: {
        variant: 'h6',
      },
      subheaderTypographyProps: {
        variant: 'caption',
      },
    },
  },
  overrides: {
    MuiInput: {
      underline: {
        '&$disabled:before': {
          borderBottomStyle: 'dashed',
          borderBottomColor: '#a1b3be',
        },
      },
    },
    MuiInputLabel: {
      shrink: {
        fontWeight: 'bold',
      },
    },
    MuiFormLabel: {
      root: {
        '&$disabled': {
          color: '#455a64',
        },
      },
      asterisk: {
        color: '#f00000',
        fontSize: 22,
      },
    },
  },
  typography: {
    useNextVariants: true,
  },
});
