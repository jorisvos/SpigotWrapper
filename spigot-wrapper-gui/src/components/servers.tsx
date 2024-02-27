import React, { useEffect } from 'react';
import { GETAllServerInfo } from '../api';
import { ServerInfo } from '../types';
import {
  CircularProgress,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import moment from 'moment';

interface Props {
  serverCount?: number;
}

export const Servers: React.FC<Props> = ({ serverCount }) => {
  const [servers, setServers] = React.useState<ServerInfo[]>();

  useEffect(() => {
    if (servers == undefined)
      GETAllServerInfo(serverCount).then((data) => setServers(data));
  });

  return (
    <>
      {servers ? (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Plugins enabled</TableCell>
              <TableCell>Created at</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Id</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {servers.map((server) => (
              <TableRow key={server.id}>
                <TableCell>
                  <Link color="primary" href={`/server/${server.id}`}>
                    {server.name}
                  </Link>
                </TableCell>
                <TableCell>{server.enablePlugins.toString()}</TableCell>
                <TableCell>
                  {moment(server.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                </TableCell>
                <TableCell>{server.isRunning ? 'Running' : 'Stopped'}</TableCell>
                <TableCell align="right">{server.id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default Servers;