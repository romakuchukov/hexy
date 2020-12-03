let data = {
  transform: {
    translate: [0, 0],
    scale: [1, 1]
  },
  objects: {
    hexagons: {
      type: 'GeometryCollection',
      geometries: [
        {
        type: 'Polygon',
        arcs: [[0, 1, 2, 3, 4, 5]],
        fill: false
      },
      {
        type: 'Polygon',
        arcs: [[4, 6, 7, 8, 9, 10]],
        fill: false
      },
      {
        type: 'Polygon',
        arcs: [[9, 11, 12, 13, 14, 15]],
        fill: false
      },
    ]
    }
  },
  arcs: [
    [[0, 2], [0, 1]], //1

    [[1, 1], [-1, 1]], //0
    [[0, 3], [1, 1]], //2
    [[1, 4], [1, -1]], //3
    [[2, 3], [0, -1]], //4
    [[2, 2], [-1, -1]], //5

    [[3, 1], [-1, 1]],
    [[2, 3], [1, 1]],
    [[3, 4], [1, -1]],
    [[4, 3], [0, -1]],
    [[4, 2], [-1, -1]],

    [[5, 1], [-1, 1]],
    [[4, 3], [1, 1]],
    [[5, 4], [1, -1]],
    [[6, 3], [0, -1]],
    [[6, 2], [-1, -1]],

  ]
};


export default data;
