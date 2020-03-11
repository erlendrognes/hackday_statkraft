import React from "react";
import { IWhoop } from "models/whoop";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import _ from "lodash";
import moment from "moment";

const SummaryChart: React.FC<{ whoops: IWhoop[] }> = ({ whoops }) => {
    let orderedWhops = _.orderBy(whoops, w => w.utcTick, "asc");
    let groupedWhops = _.groupBy(orderedWhops, b =>
        moment(b.utcTick)
            .startOf("day")
            .valueOf()
    );

    const options: Highcharts.Options = {
        chart: {
            type: "area",
            height: 450
        },
        title: {
            text: "Daily summary"
        },
        xAxis: {
            categories: _.map(Object.keys(groupedWhops), key => moment(+key).format("ddd MMM Do")),
            labels: {
                rotation: 315
            }
        },
        plotOptions: {
            area: {
                marker: {
                    enabled: false,
                    symbol: "circle",
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        yAxis: {
            allowDecimals: false,
            title: { text: "" }
        },
        credits: {
            enabled: false
        },
        series: [
            {
                showInLegend: false,
                type: "area",
                data: _.map(groupedWhops, g => g.length),
                color: "#ff6858",
                name: "Whoop count"
            }
        ]
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default SummaryChart;
