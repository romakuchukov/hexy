//https://bl.ocks.org/mbostock/5249328
import { mesh } from 'topojson';
import { primer } from './data';

import { getArcs, hexProjection, hexTopology } from './util';

const svg = d3.select('body').append('svg');
const border = svg.append('path').attr('class', 'border');

const projection = hexProjection(20);
const path = d3.geoPath(projection);

const width = 960;
const height = 500;
const board = { rows: 1, columns: 1 };

const topology = {
  transform: {
    translate: [0, 0],
    scale: [1, 1]
  },
  objects: {
    hexagons: {
      type: 'GeometryCollection',
      geometries: hexTopology(board)
    }
  },
  arcs: [
    [[0, 2], [0, 1]],
    ...getArcs(board, primer)
  ]
};

const onClick = (e, data) => {
  data.fill = !data.fill;
  d3.select(e.target).classed('fill', data.fill);
  border.call(redraw);
}

const redraw = (border) => {
  border.attr('d', path(mesh(topology, topology.objects.hexagons, (a, b) => a.fill ^ b.fill )));
};

svg.attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMinYMin meet');

svg.append('g')
  .attr('class', 'hexagon')
  .selectAll('path')
  .data(topology.objects.hexagons.geometries)
  .enter()
  .append('path')
  .attr('d', d => path(mesh(topology, d)))
  .attr('class', d => d.fill ? 'fill' : null)
  .on('click', onClick)


svg.append('path')
  .data(topology.objects.hexagons.geometries)
  //.enter()
  .attr('d', d => `${path(mesh(topology, d))}Z`)
  .attr('class', 'mesh')
