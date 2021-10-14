import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({

  animationHeart: {
    color: 'red',
    animation: '$heart 1s 1',
  },

  animationHeartClose: {
    animation: '$heartClose 1s 1',
  },

  '@keyframes heart': {
    '0%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.3)',
    },
    '100%': {
      transform: 'scale(1)',
    }
  },

  '@keyframes heartClose': {
    '0%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.3)',
    },
    '100%': {
      transform: 'scale(1)',
    }
  }
}));
