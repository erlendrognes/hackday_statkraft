import React from 'react'
import { IWhoop } from 'models/whoop';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import _ from 'lodash';
import moment from 'moment';

const SummaryChart: React.FC<{ whoops: IWhoop[] }> = ({ whoops }) => {
    let grouped = _.groupBy(whoops, (b) =>
        moment(b.utcTick).startOf('month').format('MMM`YY'));

    const options: Highcharts.Options = {
        chart: {
            type: "area",
            height: 450
        },
        title: {
            text: 'Monthly summary'
        },
        xAxis: {
            categories: _.map(Object.keys(grouped)),
            labels: {
                rotation: 315
            }
        },
        plotOptions: {
            area: {
                marker: {
                    enabled: false,
                    symbol: 'circle',
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
        series: [{
            showInLegend: false,
            type: "area",
            data: _.map(grouped, g => g.length),
            color: "#ff6858",
            name: "Whoop count"
        }]


    };


    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={options} />
    )
}


export default SummaryChart;
