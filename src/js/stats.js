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

    Highcharts.chart("crimeFreqContainer", {
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
            name: "Crime Frequency",
            colorByPoint: true,
            data: crimeFreqChartSeriesData
        }]
    });
}

// Takes an object of {month: crimeCount} and creates the bar graph.
export function createCrimeOverTimeChart(crimesPerMonth) {
    let crimes = [];

    for (const month in crimesPerMonth) {
        crimes.push(crimesPerMonth[month]);
    }

    Highcharts.chart("crimeOverTimeContainer", {
        chart: {
            type: "column"
        },
        title: {
            text: ""
        },
        xAxis: {
            categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
            ]
        },
        yAxis: {
            title: {
                text: "Crime Count"
            }
        },
        series: [{
            name: "",
            data: crimes
        }]
    });
}
