const data = {
    labels: [],
    datasets: [{
        label: 'Stats',
        data: "",
        fill: true,
        backgroundColor: 'rgba(100,149,237,0.2)',
        borderColor: 'blue',
        pointBackgroundColor: 'blue',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'blue'
    }]
};

const config = {
    type: 'radar',
    data: data,
    options: {
        elements: {
            line: {
                borderWidth: 1
            }
        }, scales: {
            r: {
                angleLines: {
                    display: false
                },
                suggestedMin: 0,
                suggestedMax: 250
            }
        },
    },
};

Chart.defaults.color = 'white';

function updateChart1() {
    data.labels = statsList;
    data.datasets[0].data = statsValues;
    chart.update();
}

function hideChart() {
    ctx.style.display = "none";
}
function showChart() {
    ctx.style.display = "initial";
}

const ctx = document.getElementById('myChart');
chart = new Chart(ctx, config)