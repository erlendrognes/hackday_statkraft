import React from "react";
import { IWhoop } from "models/whoop";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import _ from "lodash";

const WhopChart: React.FC<{ whoops: _.Dictionary<IWhoop[]> }> = ({ whoops }) => {
    const data = _.map(whoops, w => {
        return {
            name: w[0].name != null ? w[0].name : "Unknown",
            y: w.length,
            color: "#1fb980"
        };
    });

    const options: Highcharts.Options = {
        title: {
            text: "Whops per person"
        },
        credits: {
            enabled: false
        },
        legend: {
            title: {
                text: ""
            }
        },
        xAxis: {
            categories: _.map(whoops, w => w[0].name)
        },
        yAxis: {
            allowDecimals: false,
            title: { text: "" }
        },
        series: [
            {
                showInLegend: false,
                type: "column",
                data: data,
                name: "Whoops"
            }
        ]
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default WhopChart;
