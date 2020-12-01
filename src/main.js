//https://bl.ocks.org/mbostock/5249328
import topology from './data';

const width = 960;
const height = 500;
const radius = 20;

function hexTopology2(radius, width, height) {
  const dx = radius * 2 * Math.sin(Math.PI / 3);
  const dy = radius * 1.5;
  const m = Math.ceil((height + radius) / dy);
  const n = Math.ceil(width / dx);
  const geometries = [];
  const arcs = [];

  for (let j = -1; j <= m; ++j) {
    for (let i = -1; i <= n; ++i) {
      const y = j * 2;
      const x = (i + (j & 1) / 2) * 2;
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


const hexTopology = (rows, columns) => {
  //[[0, 1, 2, 3, 4, 5]]
  let arcs = [];
  let positions = [];
  for (let i = 0; i < 20; i++) {
    positions.push(i);

    if(i%5 === 0 && i > 0) {
      arcs.push([positions]);
      positions = [];
      positions.push(i-1);

    }

    //a.push([0, 1, 2, 3, 4, 5])
  }
console.log(arcs);
  // [0, 1, 2, 3, 4, 5]
  // [4, 6, 7, 8, 9, 10]
  // [9, 11, 12, 13, 14, 15]
  // [14, 16, 17, 18, 19, 20]

  //return
}

hexTopology(10, 30)//console.log();

const hexProjection = (radius) => {
  const dx = radius * 2 * Math.sin(Math.PI / 3);
  const dy = radius * 1.5;
  return {
    stream: (stream) => ({
        point: (x, y) => { stream.point(x * dx / 2, (y - (2 - (y & 1)) / 3) * dy / 2); },
        lineStart: () => { stream.lineStart(); },
        lineEnd: () => { stream.lineEnd(); },
        polygonStart: () => { stream.polygonStart(); },
        polygonEnd: () => { stream.polygonEnd(); }
    })
  };
}

//const topology = hexTopology(radius, width, height);
//console.log(JSON.stringify(topology))
const projection = hexProjection(radius);
const path = d3.geoPath().projection(projection);

const onClick = (e, data) => {
  data.fill = !data.fill;
  d3.select(e.target).classed('fill', data.fill);
  border.call(redraw);
}

const svg = d3.select('body').append('svg');

svg.attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMinYMin meet');

svg.append('g')
  .attr('class', 'hexagon')
  .selectAll('path')
  .data(topology.objects.hexagons.geometries)
  .enter()
  .append('path')
  //.attr('d', (d) => path(topojson.feature(topology, d)))
  .attr('d', (d) => path(topojson.mesh(topology, d)))
  .attr('class', (d) => d.fill ? 'fill' : null)
  .on('click', onClick)

svg.append('path')
  .datum(topojson.mesh(topology, topology.objects.hexagons))
  .attr('d', path)
  .attr('class', 'mesh');

const border = svg.append('path').attr('class', 'border');

const redraw = (border) => {
  border.attr('d', path(topojson.mesh(topology, topology.objects.hexagons, (a, b) => a.fill ^ b.fill)));
};

//const outerBorder = svg.append('path').attr('class', 'outerBorder');

//outerBorder.attr('d', path())

