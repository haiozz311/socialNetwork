import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  rootPaper: {
    backgroundColor: 'var(--bg-color-accent)',
    borderRadius: 'var(--border-radius)',
    width: '100%',
  },

  title: {
    padding: '1.4rem 2.4rem',
    color: 'var(--title-color)',
    fontWeight: 500,
    fontSize: '2.4rem',
  },

  content: {
    borderTop: 'solid 1px var(--border-color)',
    borderBottom: 'solid 1px var(--border-color)',
    backgroundColor: 'var(--bg-color-sec)',
    padding: '1.2rem 2.4rem',
  },

  contentItem: {
    padding: '1.6rem',
    margin: '1.6rem 0',
    borderRadius: 'var(--sm-border-radius)',
    border: 'solid 1px var(--border-color)',
  },

  contentLabel: {
    fontWeight: 500,
    fontSize: '1.8rem',
    marginBottom: '1.2rem',
    textTransform: 'capitalize',
    marginRight: '10%',
  },

   bodyLabel: {
    marginRight: '15%',
  },

  blockActive: {
    background: 'black',
    color: 'white',
    padding: '10px',
  },

  borderInput: {
    border: '1px solid black',
    padding: '6px'
  },

  actions: {
    padding: '1.2rem',
  },

  bodyLabelFocus: {
    marginRight: '13%',
  },

  role: {
    padding: '6px',
  },

  widthCoin: {
    width: '74px'
  }

}));
