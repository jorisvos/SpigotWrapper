import React, { KeyboardEvent, useState } from 'react';
import { Box, InputAdornment, TextField } from '@mui/material';
import { ScrollToElement } from './index';

interface Props {
  log: string;
  sendCommand?: (command: string) => void;
  enableInput?: boolean;
}

export const Terminal: React.FC<Props> = ({
  log,
  sendCommand,
  enableInput,
}) => {
  const [command, setCommand] = useState<string>('');

  const handleEnter = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.keyCode === 13) {
      if (command.trim() !== '' && sendCommand) {
        sendCommand(command);
      }
      setCommand('');
    }
  };

  return (
    <Box sx={{
      height: '400px',
      padding: 2,
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
      borderRadius: '4px',
      borderWidth: '1px',
      border: 'solid',
      fontFamily: 'Menlo,Monaco,Consolas,"Courier New",monospace',
      whiteSpace: 'pre',
      overflowY: 'scroll',
    }}>
      <pre style={{ marginBottom: 0 }} id="log">
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
                <span style={{
                  color: '#ff0000',
                  fontWeight: 'bold',
                }}>{'>'}</span>
              </InputAdornment>
            ),
          }}
        />
      )}
      <ScrollToElement />
    </Box>
  );
};

export default Terminal;
