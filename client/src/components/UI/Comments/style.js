import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
    position: 'fixed',
    bottom: 16,
    right: 16,

    '& .MuiSpeedDialAction-fab': {
      backgroundColor: 'var(--bg-color-accent)',
    },

    '& .MuiFab-label': {
      color: 'var(--label-color)',
    },

    '& .MuiSpeedDialIcon-icon': {
      color: 'var(--light-grey)',
    },
  },

  textName: {
    margin: 'auto 0',
    fontSize: '16px'
  },

  textContent: {
    fontSize: '16px',
    background: '#f9fafc',
    padding: '7px',
    borderRadius: '10px',
    margin: '0 1.6rem'
  },

  point: {
    cursor: 'pointer',
    fontWeight: 'bold'
  },

  comment_input: {
    background: '#f7f7f7',
    border: 'none',
    outline: 'none',
    flex: 1,
    overflow: 'auto',
    padding: '15px 20px',
  },

  area: {
    width: '100%',
    padding: '5px'
  },

  bgWhite: {
    backgroundColor: '#ffffff',
  },
  btnSubmit: {
    padding: '13px',
    borderColor: '#ffffff',
  }


}));
