// let data = {
//   transform: {
//     translate: [0, 0],
//     scale: [1, 1]
//   },
//   objects: {
//     hexagons: {
//       type: 'GeometryCollection',
//       geometries: [{
//         type: 'Polygon',
//         arcs: [[1, 2, 3, 4, 5, 6]],
//         fill: true
//       }]
//     }
//   },
//   arcs: [
//     [[-1, -3],[1, 1]],
//     [[0, -2], [0, 1]],
//     [[0, -1], [-1, 1]],
//     [[1, -3], [1, 1]],
//     [[2, -2], [0, 1]],
//     [[2, -1], [-1, 1]],
//     [[3, -3], [1, 1]],
//     [[4, -2], [0, 1]],
//     [[4, -1], [-1, 1]],
//     [[5, -3], [1, 1]],
//     [[6, -2], [0, 1]],
//     [[6, -1], [-1, 1]],
//     [[-2, -1],[1, 1]],
//     [[-1, 0], [0, 1]],
//     [[-1, 1], [-1, 1]],
//     [[0, -1], [1, 1]],

//   ]
// }


let data = {
  transform: {
    translate: [0, 0],
    scale: [1, 1]
  },
  objects: {
    hexagons: {
      type: 'GeometryCollection',
      geometries: [{
        type: 'Polygon',
        arcs: [[0, 1, 2, 3, 4, 5]],
        fill: false
      }]
    }
  },
  arcs: [
    [[1, 1], [-1, 1]],
    [[0, 2], [0, 1]],
    [[0, 3], [1, 1]],
    [[1, 1], [1, 1]],
    [[2, 3], [0, -1]],
    [[1, 4], [1, -1]]
  ]
};


export default data;
