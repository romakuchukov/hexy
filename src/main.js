import topology from './data';

const width = 960;
const height = 500;
const radius = 20;

const projection = hexProjection(radius);
const path = d3.geoPath().projection(projection);

let mousing = 0;

function mousedown (e, data) {
  mousing = data.fill ? -1 : +1;
  mousemove.apply(e.target, arguments);
}

function mousemove(e, data) {
  if (mousing) {
    d3.select(e.target).classed('fill', data.fill = mousing > 0);
    border.call(redraw);
  }
}

function mouseup(e) {
  mousemove.apply(e.target, arguments);
  mousing = 0;
}


const svg = d3.select('body')
  .append('svg')
  .attr('preserveAspectRatio', 'xMinYMin meet')
  .attr('viewBox', `0 0 ${width} ${height}`)


svg.append('g')
  .attr('class', 'hexagon')
  .selectAll('path')
  .data(topology.objects.hexagons.geometries)
  .enter().append('path')
  .attr('d', (d) => path(topojson.feature(topology, d)))
  .attr('class', (d) => d.fill ? 'fill' : null)
  .on('mousedown', mousedown)
  .on('mousemove', mousemove)
  .on('mouseup', mouseup);

svg.append('path')
  .datum(topojson.mesh(topology, topology.objects.hexagons))
  .attr('class', 'mesh')
  .attr('d', path);

const border = svg.append('path').attr('class', 'border').call(redraw);

function redraw(border) {
  border.attr('d', path(topojson.mesh(topology, topology.objects.hexagons, (a, b) => a.fill ^ b.fill)));
}

function hexProjection(radius) {
  const dx = radius * 2 * Math.sin(Math.PI / 3);
  const dy = radius * 1.5;
  return {
    stream: function(stream) {
      return {
        point: function(x, y) { stream.point(x * dx / 2, (y - (2 - (y & 1)) / 3) * dy / 2); },
        lineStart: function() { stream.lineStart(); },
        lineEnd: function() { stream.lineEnd(); },
        polygonStart: function() { stream.polygonStart(); },
        polygonEnd: function() { stream.polygonEnd(); }
      };
    }
  };
}
