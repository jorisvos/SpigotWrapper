import React from 'react';
import { ServerInfo } from '../types';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import moment from 'moment';
import { Link } from 'react-router-dom';

interface Props {
  servers?: ServerInfo[];
}

export const ServersOverview: React.FC<Props> = ({ servers }) => (
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
                <Link color="primary" to={`/server/${server.id}`}>
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

export default ServersOverview;
