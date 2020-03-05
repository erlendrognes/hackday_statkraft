import React from 'react'
import { ListItem, ListItemText } from '@material-ui/core';
import { IWhoop } from 'models/whoop';
import moment from 'moment';

const LatestWoops: React.FC<{whoop: IWhoop}> = ({ whoop }) => {
  const header = whoop.name + " - "  + moment(whoop.utcTick).format("DD.MM.YYYY - HH:mm");
   return (
    <ListItem>
      <ListItemText
        primary={header} secondary={whoop.body } />
    </ListItem>
  )
}

export default LatestWoops;
