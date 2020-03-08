import React from "react";
import { Typography, Card, CardContent } from "@material-ui/core";
import { IWhoop } from "models/whoop";
import moment from "moment";

const LatestWoops: React.FC<{ whoop: IWhoop }> = ({ whoop }) => {
    return (
        <Card style={{ marginBottom: "10px", backgroundColor: "#f1f1f1" }}>
            <CardContent>
                <Typography variant="h6" align="center">
                    <u>{whoop.name}</u>
                </Typography>
                <Typography variant="body1" align="left">
                    {whoop.body}
                </Typography>
                <Typography variant="body2" align="right">
                    <i>{moment(whoop.utcTick).format("MMMM Do HH:mm")}</i>
                </Typography>
            </CardContent>
        </Card>
    );
};

export default LatestWoops;
