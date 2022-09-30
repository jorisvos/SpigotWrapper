import React, { useState } from 'react';
import { useStyles } from './styles';
import { InputAdornment, TextField } from '@mui/material';
import { ScrollToElement } from '../index';

interface Props {
  log: string;
  className?: string;
  sendCommand?: (command: string) => void;
  enableInput?: boolean;
}

export const Terminal: React.FC<Props> = ({
  log,
  className,
  sendCommand,
  enableInput,
}) => {
  const classes = useStyles();
  const [command, setCommand] = useState<string>('');

  const handleEnter = (event: any) => {
    if (event.keyCode === 13) {
      if (command.trim() !== '' && sendCommand) {
        sendCommand(command);
      }
      setCommand('');
    }
  };

  return (
    <div className={classes.terminalContainer}>
      <pre className={classes.log} id="log">
        {log}
      </pre>
      {enableInput && (
        <TextField
          style={{ marginTop: 'auto' }}
          placeholder="command"
          onChange={(event) => setCommand(event.target.value)}
          onKeyDown={handleEnter}
          value={command}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <span className={classes.prompt}>{'>'}</span>
              </InputAdornment>
            ),
          }}
        />
      )}
      <ScrollToElement />
    </div>
  );
};

export default Terminal;
