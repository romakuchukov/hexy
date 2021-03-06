//https://bl.ocks.org/mbostock/5249328
import { primer } from './data';
import { mesh } from 'topojson';

const cloneArray = (array) => {
  const clone = [];

  for(const item of array) {
    clone.push((typeof(item)==='object') ? cloneArray(item) : item);
  }

  return clone;
};

const getArcs = ({instances, rows}) => {

  const clonedPrimer = cloneArray(primer.arcs.slice(1));
  const arcs = [];

  arcs.push(cloneArray(clonedPrimer));


  while (instances--) {
    // for (let i = 0; i !== clonedPrimer.length; i++) {
    //   clonedPrimer[i][0][0] = clonedPrimer[i][0][0]+2;
    // }
    clonedPrimer.forEach(item => {
      item[0][0] = item[0][0]+2;
    });
    arcs.push(cloneArray(clonedPrimer));
  }

  //let clonedArcs = cloneArray(arcs);
  // clone and adjust cells
  let clonedArcs = cloneArray(arcs);

  while (rows--) {
    //console.log(, 1);
    clonedArcs.forEach(item => {
        item.forEach(val => {
          //console.log(val[0][0]);
          val[0][0] = val[0][0]+5;
          val[1][0] = val[1][0]+5;
          //console.log(val[0][0]);
        });
        arcs.push(cloneArray(item));
    });
  }

  return arcs.flat();
};

const hexTopology = ({instances}) => {
  const sides = 5;
  const polygons = sides*(instances+1);
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

  return hexArcs;
};

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
};

const width = 960;
const height = 500;
const radius = 20;
const board = { instances: 20, rows: 2 };

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
    ...getArcs(board)
  ]
};


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

