import React from 'react'
import { ListItem, ListItemText } from '@material-ui/core';

const LatestWoops: React.FC = () => {
   return (
    <ListItem>
      <ListItemText
        primary="Erlend Rognes" secondary="Mar 04, 2020" />
    </ListItem>
  )
}

export default LatestWoops;
