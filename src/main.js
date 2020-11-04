import topology from './data';

const width = 960;
const height = 500;
const radius = 20;

const projection = hexProjection(radius);

const path = d3.geo.path().projection(projection);

const svg = d3.select('body')
  .append('svg')
  .attr('preserveAspectRatio', 'xMinYMin meet')
  .attr('viewBox', `0 0 ${width} ${height}`)


svg.append('g')
  .attr('class', 'hexagon')
  .selectAll('path')
  .data(topology.objects.hexagons.geometries)
  .enter().append('path')
  .attr('d', function(d) { return path(topojson.feature(topology, d)); })
  .attr('class', function(d) { return d.fill ? 'fill' : null; })
  .on('mousedown', mousedown)
  .on('mousemove', mousemove)
  .on('mouseup', mouseup);

svg.append('path')
  .datum(topojson.mesh(topology, topology.objects.hexagons))
  .attr('class', 'mesh')
  .attr('d', path);

const border = svg.append('path').attr('class', 'border').call(redraw);

let mousing = 0;

function mousedown(d) {

  mousing = d.fill ? -1 : +1;
  mousemove.apply(this, arguments);
}

function mousemove(d) {
  if (mousing) {
    d3.select(this).classed('fill', d.fill = mousing > 0);
    border.call(redraw);
  }
}

function mouseup() {
  mousemove.apply(this, arguments);
  mousing = 0;
}

function redraw(border) {
  border.attr('d', path(topojson.mesh(topology, topology.objects.hexagons, function(a, b) { return a.fill ^ b.fill; })));
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