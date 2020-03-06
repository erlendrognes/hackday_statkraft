import React from "react";
import { Typography, ListItem, ListItemText } from "@material-ui/core";
import { IWhoop } from "models/whoop";
import moment from "moment";

const LatestWoops: React.FC<{ whoop: IWhoop }> = ({ whoop }) => {
    const header = whoop.name + " - " + moment(whoop.utcTick).format("DD.MM.YYYY - HH:mm");
    return (
        <ListItem>
            <ListItemText>
                <Typography variant="h6" align="center">
                    {whoop.name}
                </Typography>
                <Typography variant="body1" align="left">
                    {whoop.body}
                </Typography>
                <Typography variant="body2" align="right">
                    <i>{moment(whoop.utcTick).format("DD.MM.YYYY - HH:mm")}</i>
                </Typography>
            </ListItemText>
        </ListItem>
    );
};

export default LatestWoops;
