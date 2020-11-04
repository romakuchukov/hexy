const width = 960;
const height = 500;
const radius = 20;

const topology = hexTopology(radius, width, height);

const projection = hexProjection(radius);

const path = d3.geo.path().projection(projection);

const svg = d3.select('body').append('svg').attr('width', width).attr('height', height);

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
  console.log(this)
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

function hexTopology(radius, width, height) {
  const dx = radius * 2 * Math.sin(Math.PI / 3);
  const dy = radius * 1.5;
  const m = Math.ceil((height + radius) / dy) + 1;
  const n = Math.ceil(width / dx) + 1;
  const geometries = [];
  const arcs = [];

  for (let j = -1; j <= m; ++j) {
    for (let i = -1; i <= n; ++i) {
      const y = j * 2, x = (i + (j & 1) / 2) * 2;
      arcs.push([[x, y - 1], [1, 1]], [[x + 1, y], [0, 1]], [[x + 1, y + 1], [-1, 1]]);
    }
  }

  for (let j = 0, q = 3; j < m; ++j, q += 6) {
    for (let i = 0; i < n; ++i, q += 3) {
      geometries.push({
        type: 'Polygon',
        arcs: [[q, q + 1, q + 2, ~(q + (n + 2 - (j & 1)) * 3), ~(q - 2), ~(q - (n + 2 + (j & 1)) * 3 + 2)]],
        fill: Math.random() > i / n * 2
      });
    }
  }

  return {
    transform: {translate: [0, 0], scale: [1, 1]},
    objects: {hexagons: {type: 'GeometryCollection', geometries: geometries}},
    arcs: arcs
  };
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