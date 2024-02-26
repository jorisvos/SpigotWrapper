import React, { useEffect } from 'react';
import { GETAllJars, GETAllServerInfo } from '../../api';
import { Jar, ServerInfo } from '../../types';
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

export const Jars = () => {
  const [jars, setJars] = React.useState<Jar[]>();

  useEffect(() => {
    if (jars == undefined) GETAllJars().then((data) => setJars(data));
  });

  return (
    <>
      {jars ? (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Minecraft API</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Created at</TableCell>
              {/* <TableCell>File name</TableCell> */}
              <TableCell align="right">Id</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jars.map((jar) => (
              <TableRow key={jar.id}>
                <TableCell>{jar.jarKind}</TableCell>
                <TableCell>{jar.minecraftVersion}</TableCell>
                <TableCell>
                  {moment(jar.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                </TableCell>
                {/* <TableCell>{jar.minecraftVersion}</TableCell> */}
                <TableCell align="right">{jar.id}</TableCell>
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

export default Jars;
