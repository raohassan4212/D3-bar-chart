// var dataset1 = [
//     ["January", 1], ["February", 20], ["March", 36],
//     ["April", 50], ["May", 70], ["June", 95],
//     ["July", 10], ["August", 60], ["September", 30],
//     ["October", 55], ["November", 1], ["December", 85],
// ];

// var datasetjio = [
//     { Month: 'January', Units: 200 }
//     , { Month: 'February', Units: 260 }
//     , { Month: 'March', Units: 320 }
//     , { Month: 'April', Units: 380 }
//     , { Month: 'May', Units: 180 }
//     , { Month: 'June', Units: 320 }
//     , { Month: 'July', Units: 460 }
//     , { Month: 'August', Units: 600 }
//     , { Month: 'September', Units: 740 }
//     , { Month: 'October', Units: 480 }
//     , { Month: 'November', Units: 560 }
//     , { Month: 'December', Units: 300 }
// ];

const myForm = document.getElementById("myForm");
const csvFile = document.getElementById("csvFile");

myForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = csvFile.files[0];

    const reader = new FileReader();

    reader.onload = function (e) {
        const text = e.target.result;

        console.log(text);

        const data = csvToArray(text);

        console.log("data is", data);
        drawGraph(data)
    }
    reader.readAsText(input);
})

function csvToArray(str, delimiter = ',') {
    const header = str.slice(0, str.indexOf("\r\n")).split(delimiter);
    const row = str.slice(str.indexOf("\n") + 1).split("\r\n");

    const arr = row.map((row) => {
        const values = row.split(delimiter);
        const el = header.reduce(function (object, header, index) {
            console.log(values[index])
            object[header] = values[index];
            return object
        }, {})
        return el
    })
    return arr;
}

function drawGraph(graphData) {

    const margin = 60;
    const width = 1000 - 2 * margin;
    const height = 600 - 2 * margin;
    const maxUnit = d3.max(graphData, (data) => data.Units)

    const svg = d3.select('svg')
        .attr("width", 1000)
        .attr("height", 600)

    const chart = svg.append('g')
        .attr('transform', `translate(${margin}, ${margin})`);

    const yScale = d3.scaleLinear()
        .domain([0, maxUnit])
        .range([height, 0])

    chart.append('g')
        .call(d3.axisLeft(yScale));

    const xScale = d3.scaleBand()
        // .domain(dataset1.map((s) => s[0]))
        
        // .domain([0, graphData.length])
        .domain(graphData.map(function (item) {
            return (item.Month);
        }))
        .range([0, width])
        .padding(0.2)


    chart.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

    chart.selectAll()
        .data(graphData)
        .enter()
        .append('rect')
        .attr('x', (s) => xScale(s.Month))
        .attr('y', (s) => yScale(s.Units))
        .attr('height', (s) => height - yScale(s.Units))
        .attr('width', xScale.bandwidth())
        .attr("stroke", "blue")
        .attr("fill", "#0EA2F7")
}

