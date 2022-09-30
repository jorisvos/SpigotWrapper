import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  terminalContainer: {
    height: 400,
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    paddingTop: 0,
    fontSize: 13,
    lineHeight: 1.42857143,
    wordBreak: 'break-all',
    wordWrap: 'break-word',
    color: '#333',
    backgroundColor: '#f5f5f5',
    borderColor: '#ccc',
    borderRadius: 4,
    borderWidth: 1,
    border: 'solid',
    fontFamily: 'Menlo,Monaco,Consolas,"Courier New",monospace',
    whiteSpace: 'pre',
    overflowY: 'scroll',
  },
  prompt: {
    color: '#ff0000',
    fontWeight: 'bold',
  },
  log: {
    marginBottom: 0,
  },
}));
