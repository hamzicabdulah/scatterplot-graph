d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', draw);

function draw(data) {
  const docWidth = document.documentElement.clientWidth;
  const width = (docWidth <= 768) ? docWidth * 0.9 : 750;
  const height = 580, margin = 55;

  const svg = d3.select('body')
                .append('svg')
                .attr('height', height)
                .attr('width', width);

  svg.append('text')
    .attr('class', 'heading')
    .style('text-anchor', 'middle')
    .attr('x', width/2)
    .attr('y', margin * 0.5)
    .text('Doping In Professional Bicycle Racing');

  svg.append('text')
    .attr('class', 'subheading')
    .style('text-anchor', 'middle')
    .attr('x', width/2)
    .attr('y', margin * 0.9)
    .text('(35 Best Times Up Alpe D\'Huez)');

  const xExtent = d3.extent(data, (d) => d.Seconds);
  const yExtent = d3.extent(data, (d) => d.Place);

  const xScale = d3.scaleTime()
                  .domain([new Date(2017, 0, 1, 0, 0, xExtent[1] + 5), new Date(2017, 0, 1, 0, 0, xExtent[0])])
                  .range([margin, width - (margin * 1.75)]);

  const yScale = d3.scaleLinear()
                  .domain([yExtent[1] + 1, yExtent[0]])
                  .range([height - margin, margin * 1.5]);

  const xAxis = d3.axisBottom(xScale)
    .ticks(5)
    .tickFormat(d3.timeFormat('%M:%S'));

  const yAxis = d3.axisLeft(yScale);

  svg.append('g')
    .attr('transform', 'translate(' + 0 + ', ' + (height - margin) + ')').call(xAxis);

  svg.append('g')
    .attr('transform', 'translate(' + margin + ', ' + 0 + ')').call(yAxis);

  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - margin/3.5)
    .attr('text-anchor', 'middle')
    .text('Time in minutes');

  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', - height / 2)
    .attr('y', margin / 2.25)
    .attr('text-anchor', 'middle')
    .text('Ranking');

  svg.selectAll('circle')
    .data(data)
    .enter()
    .append('text')
    .attr('x', (d) => xScale(new Date(2017, 0, 1, 0, 0, d.Seconds)) + 8)
    .attr('y', (d) => yScale(d.Place) + 4)
    .attr('class', 'biker-name')
    .text((d) => d.Name);

  let tooltip = svg.append('foreignObject')
    .attr('width', 220)
    .attr('height', 200)
    .attr('x', docWidth <= 550 ? width * 0.3 : width * 0.6)
    .attr('y', height - 250)
    .append('xhtml:div')
    .attr('class', 'tooltip')

  svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) => xScale(new Date(2017, 0, 1, 0, 0, d.Seconds)))
    .attr('cy', (d) => yScale(d.Place))
    .attr('r', 5)
    .attr('fill', function(d) {
      return (d.Doping.length < 1) ? '#2E7D32' : '#F44336';
    })
    .on('mouseover', function(d) {
      tooltip.html(
        '<h4>' + d.Name + ' (' + d.Nationality + ')</h4><p>Time: ' + d.Time + ', Year: ' + d.Year + '</p><p>' + d.Doping + '</p>'
      ).style('padding', '.5em');
    })
    .on('mouseout', function() {
      tooltip.html('')
        .style('padding', 0);
    });

  const legend = svg.append('g')
    .attr('class', 'legend')
    .attr('x', 50)
    .attr('y', 50);

  const legendData = [['#F44336', 'Rider with doping allegations', margin * 1.5 + 15], ['#2E7D32', 'No doping allegations', margin * 1.5 + 30]];

  legend.selectAll('circle')
    .data(legendData)
    .enter()
    .append('circle')
    .attr('cx', margin * 1.2)
    .attr('cy', (d) => d[2])
    .attr('r', 5)
    .attr('fill', (d) => d[0])

  legend.selectAll('text')
    .data(legendData)
    .enter()
    .append('text')
    .attr('x', (margin * 1.2) + 8)
    .attr('y', (d) => d[2] + 4)
    .text((d) => d[1]);

  window.onresize = function(event) {
    clearScreen();
    draw(data);
  }
}

function clearScreen() {
  d3.select('svg').remove();
}
