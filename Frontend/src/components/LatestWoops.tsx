import React from 'react'
import { ListItem, ListItemText } from '@material-ui/core';
import { IWhoop } from 'models/whoop';

const LatestWoops: React.FC<{whoop: IWhoop}> = ({ whoop }) => {
   return (
    <ListItem>
      <ListItemText
        primary={whoop.name} secondary={whoop.body} />
    </ListItem>
  )
}

export default LatestWoops;
