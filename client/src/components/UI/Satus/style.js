import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
    backgroundColor: 'var(--bg-color-accent)',
    color: 'var(--text-color)',
    borderRadius: 'var(--border-radius)',
  },
  status: {
    padding: '12px 16px 10px',
    boxShadow: 'var(--box-shadow)',
  },
  statusBtn: {
    backgroundColor: '#F0F2F5',
    borderRadius: '30px',
    borderColor: 'Transparent',
    padding: '12px',
    width: '100%',
    textAlign: 'start'
  }
}));
