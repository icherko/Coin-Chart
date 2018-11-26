/*jslint browser:true */
//code to draw crypto price charts
//api reference
//https://min-api.cryptocompare.com/
//chart reference
//https://google-developers.appspot.com/chart/interactive/docs/gallery/candlestickchart
//code to make chart responsive
//https://codepen.io/flopreynat/pen/BfLkA
google.charts.load("current", {
    "packages": ["corechart"]
});
let GotData = 0;
let RowData;
let ChartOptions;
function prepareData() {
    let Url = "";
    //get currency pair
    document.getElementById("currency").value = document.getElementById("currency").value.toUpperCase();
    if (document.getElementById("currency").value === "") {
        window.alert("Please enter a currency like BTC");
        return;
    }
    document.getElementById("base").value = document.getElementById("base").value.toUpperCase();
    if (document.getElementById("base").value === "") {
        window.alert("Please enter a base currency like USD");
        return;
    }
    //data Url = "https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=USD&limit=100";
    Url = "https://min-api.cryptocompare.com/data/histoday?fsym=" + document.getElementById("currency").value;
    Url += "&tsym=" + document.getElementById("base").value + "&limit=100";
    google.charts.load("current", { "packages": ["corechart"] });
    //get price data history for coin
    $.get(Url, function (Coindata, status) {
        if (status !== "success") {
            window.alert("Could not get price data");
            return;
        }
        if (Coindata.Response !== "Success") {
            window.alert("Invalid symbol");
            return;
        }
        let PriceHistory = Coindata.Data;
        let i;
        let Column;
        let Row = [];
        let today;
        let total = PriceHistory.length;
        if (total === 0) {
            window.alert("Missing price data");
            return;
        }
        //copy price history data from object into an array
        //{"time":1530835200,"close":6602.02,"high":6633.44,"low":6458.14,"open":6534.81,"volumefrom":47259.68,"volumeto":310759733.14}
        for (i = 0; i < total; i += 1) {
            Column = [];
            today = timeConverter(PriceHistory[i].time);
            Column.push(today);
            Column.push(PriceHistory[i].low);
            Column.push(PriceHistory[i].open);
            Column.push(PriceHistory[i].close);
            Column.push(PriceHistory[i].high);
            Row.push(Column);
        }
        //convert array to data table
        RowData = google.visualization.arrayToDataTable(Row, true);
        GotData = 1;
        //format the chart
        ChartOptions = {
            legend: "none",
            candlestick: {
                fallingColor: { stroke: "#000000", fill: "#a52714", strokeWidth: "0.5" },
                risingColor: { stroke: "#000000", fill: "#0f9d58", strokeWidth: "0.5" } // green
            },
            colors: ["black"],
            chartArea: { left: 80, top: 20, width: "90%", height: "80%" }
        };
        google.charts.setOnLoadCallback(drawChart);
    });
}
function drawChart() {
    //draw the chart
    if (GotData === 1) {
        let chartDiv = document.getElementById("chart_div");
        let chart = new google.visualization.CandlestickChart(chartDiv);
        chart.draw(RowData, ChartOptions);
    }
}
function timeConverter(UNIX_timestamp) {
    //convert timestamp to date string
    let a = new Date(UNIX_timestamp * 1000);
    let year = a.getFullYear();
    let month = a.getMonth();
    let day = a.getDate();
    let time = month + "/" + day + "/" + year;
    return time;
}
window.onload = function () {
    document.getElementById("btnSubmit").onclick = function () { prepareData(); };
    //open default btc chart
    prepareData();
};
//draw chart again when resize
$(window).resize(function () {
    drawChart();
});
//# sourceMappingURL=coin-chart.js.map