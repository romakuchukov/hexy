//https://bl.ocks.org/mbostock/5249328
import topology from './data';
import { mesh } from 'topojson';

const width = 960;
const height = 500;
const radius = 20;

const {
  arcs,
  objects : {
    hexagons: {
      geometries
    }
  }
} = topology;

const primer = {
  arcs: arcs.slice(1),
  geometries: geometries[0]
};

const cloneArray = (array) => {
  const clone = [];
  for(const item of array) {
    clone.push((typeof(item)==='object') ? cloneArray(item) : item);
  }
  return clone;
};

const getArcs = (rows, columns) => {

  const clone = cloneArray(primer.arcs)//JSON.parse(JSON.stringify(primer.arcs));
  const arcs = [];

  while (rows--) {
    for (let i = 0; i < columns; i++) {
      clone[i][0][0] = clone[i][0][0]+2;
      arcs.push(cloneArray(clone));
    }
  }

  return arcs;
}

const hexTopology = (rows, columns) => {

  const sides = 5;
  const polygons = sides*columns;

  const hexArcs = [];
  let positions = [];

  for (let i = 0; i < polygons; i++) {
    positions.push(i);

    if((i % sides) === 0 && i > 0) {
      hexArcs.push({ type: 'Polygon', arcs: [positions], fill: false });
      positions = [];
      positions.push(i-1);
    }
  }
  // console.log(topology)
  //console.log(hexArcs);
}

hexTopology(2, 4)//console.log();
console.log(getArcs(2, 4))

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
  .attr('d', (d) => path(mesh(topology, d)))
  .attr('class', (d) => d.fill ? 'fill' : null)
  .on('click', onClick)

svg.append('path')
  .datum(mesh(topology, topology.objects.hexagons))
  .attr('d', path)
  .attr('class', 'mesh');

const border = svg.append('path').attr('class', 'border');

const redraw = (border) => {
  border.attr('d', path(mesh(topology, topology.objects.hexagons, (a, b) => a.fill ^ b.fill)));
};

//const outerBorder = svg.append('path').attr('class', 'outerBorder');

//outerBorder.attr('d', path())

