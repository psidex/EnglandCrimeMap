export function createPieChart(containerName, seriesName, seriesData) {
    Highcharts.chart(containerName, {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: "pie"
        },
        title: {
            text: ""
        },
        tooltip: {
            pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
        },
        accessibility: {
            point: {
                valueSuffix: "%"
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: "pointer",
                dataLabels: {
                    enabled: true,
                    format: "<b>{point.name}</b>: {point.percentage:.1f} %"
                }
            }
        },
        series: [{
            name: seriesName,
            colorByPoint: true,
            data: seriesData
        }]
    });
}

// crimeCount should be a number, crimeCategoryFreq should be an object of category:count. This then takes them and
// creates a pie chart showing the frequency of each category.
export function createCrimeFreqChart(crimeCount, crimeCategoryFreq) {
    const crimeFreqChartSeriesData = [];
    const onePercent = crimeCount / 100;

    for (const cat in crimeCategoryFreq) {
        crimeFreqChartSeriesData.push(
            {
                name: cat,
                y: crimeCategoryFreq[cat] / onePercent
            }
        );
    }

    createPieChart("crimeFreqContainer", "Crime Frequency", crimeFreqChartSeriesData);
}
