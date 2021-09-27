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
    display: 'flex',
    justifyContent: 'space-between',
  },

  contentLabel: {
    fontWeight: 500,
    fontSize: '1.8rem',
    marginBottom: '1.2rem',
    textTransform: 'capitalize',
  },

  actions: {
    padding: '1.2rem',
  },

  content_status: {
    width: '100%',
    height: '100px',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    marginTop: '2rem',
    padding: '10px 12px',
  },

  cameraIconWrap: {
    position: 'absolute',
    right: 0,
    bottom: 0,

    width: '4.2rem',
    height: '4.2rem',
    padding: '1.2rem',

    backgroundColor: 'var(--primary-color)',
    borderRadius: '50%',
    cursor: 'pointer',
    border: 'solid 5px var(--bg-color-sec)',

    '&:hover, &:active': {
      opacity: 0.85,
    },
  },

  cameraIcon: {
    color: 'var(--text-color)',
    fontSize: '2rem',
  },

  fileInput: {
    position: 'absolute',
    width: '4.2rem',
    height: '4.2rem',
    top: 0,
    left: 0,
    opacity: 0,
    cursor: 'pointer',
  },

  input: {
    display: 'none'
  },

  extended: {
    borderColor: 'transparent',
    padding: '8px',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    borderRadius: '12px',
    textTransform: 'initial',
    '&:hover': {
      backgroundColor: 'var(--bg-color-accent)'
    }
  },

  show_images: {
    display: 'flex',
  },

  show_images_img: {
    width: '100%',
    height: 'auto',
  },

  cover_img: {
    width: '12rem',
    height: '12rem',
    margin: '0 5px',
    position: 'relative',
  },

  btn_close: {
    position: 'absolute',
    top: 0,
    right: 0,
  }
}));
