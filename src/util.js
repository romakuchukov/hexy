const cloneArray = (array) => {
  const clone = [];

  for(const item of array) {
    clone.push((typeof(item)==='object') ? cloneArray(item) : item);
  }

  return clone;
};

export const getArcs = ({rows, columns}, primer) => {

  const clonedPrimer = cloneArray(primer.arcs.slice(1));
  const arcs = [];

  arcs.push(cloneArray(clonedPrimer));


  while (columns--) {
    clonedPrimer.forEach(item => {
      item[0][0] = item[0][0];
    });
    arcs.push(cloneArray(clonedPrimer));
  }

  let clonedArcs = cloneArray(arcs);

  while (rows--) {

    clonedArcs.forEach(item => {
        item.forEach(val => {
          //console.log(val)
          val[0][0] = val[0][0];
          val[0][1] = val[0][1];
        });
        arcs.push(cloneArray(item));
    });
  }

  return arcs.flat();
};

export const hexProjection = (radius) => {
  const dx = radius * 2 * Math.sin(Math.PI / 3);
  const dy = radius * 1.5;
  return {
    stream: stream => ({
      point: (x, y) => { stream.point(x * dx / 2, (y - (2 - (y & 1)) / 3) * dy / 2); },
      lineStart: () => { stream.lineStart(); },
      lineEnd: () => { stream.lineEnd(); },
      polygonStart: () => { stream.polygonStart(); },
      polygonEnd: () => { stream.polygonEnd(); }
    })
  };
};

export const hexTopology = ({ rows, columns }) => {
  const sides = 6;
  const polygons = sides*(columns)*(rows);
  const hexArcs = [];
  let positions = [];

  for (let i = 1; i <= polygons; i++) {
    positions.push(i);

    if((i % sides) === 0 && i > 0) {
      hexArcs.push({ type: 'Polygon', arcs: [positions], fill: false });
      positions = [];
      positions.push(i-1);
    }
  }

  return hexArcs;
};
