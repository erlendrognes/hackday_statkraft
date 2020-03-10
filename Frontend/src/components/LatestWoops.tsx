import React from "react";
import { Typography, Card, CardContent } from "@material-ui/core";
import { IWhoop } from "models/whoop";
import moment from "moment";
import whop_transparent from "../img/whop_transparent.png";

const LatestWoops: React.FC<{ whoop: IWhoop }> = ({ whoop }) => {
    return (
        <Card style={{ marginBottom: "10px", backgroundImage: `url(${whop_transparent})`, border: " 1px solid #ff6857" }}>
            <CardContent>
                <Typography variant="h6" align="left">
                    {whoop.name}
                    <span style={{ float: "right", fontSize: "15px", fontWeight: 400, color: "#bfbfbf", fontFamily: "cursive" }}>
                        <i>{moment(whoop.utcTick).format("MMMM Do HH:mm")}</i>
                    </span>
                </Typography>
                <Typography variant="body1" align="left">
                    {whoop.body}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default LatestWoops;
