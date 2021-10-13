const DATA = [
  {x: 5, y: 11, value: 4},
  {x: 5, y: 10, value: 4},
  {x: 5, y: 9, value: 4},
  //
  {x: 6, y: 11, value: 4},
  {x: 6, y: 10, value: 4},
  {x: 6, y: 9, value: 4},
  {x: 6, y: 8, value: 4},
  //
  {x: 7, y: 11, value: 4},
  {x: 7, y: 10, value: 4},
  {x: 7, y: 9, value: 4},
  {x: 7, y: 8, value: 4},
  {x: 7, y: 7, value: 4},
  //
  {x: 8, y: 11, value: 4},
  {x: 8, y: 10, value: 4},

  {x: 8, y: 8, value: 4},
  {x: 8, y: 7, value: 4},
  {x: 8, y: 6, value: 4},
  //
  {x: 9, y: 11, value: 4},
  {x: 9, y: 10, value: 4},

  {x: 9, y: 7, value: 4},
  {x: 9, y: 6, value: 4},
  {x: 9, y: 5, value: 4},
  //
  {x: 10, y: 11, value: 4},
  {x: 10, y: 10, value: 4},

  {x: 10, y: 6, value: 4},
  {x: 10, y: 5, value: 4},
  //
  {x: 11, y: 12, value: 4},
  {x: 11, y: 11, value: 4},
  {x: 11, y: 10, value: 4},
  {x: 11, y: 9, value: 4},
  {x: 11, y: 8, value: 4},
  {x: 11, y: 7, value: 4},
  {x: 11, y: 6, value: 4},
  {x: 11, y: 5, value: 4},
  //
  {x: 12, y: 12, value: 4},
  {x: 12, y: 11, value: 4},
  {x: 12, y: 10, value: 4},
  {x: 12, y: 9, value: 4},
  {x: 12, y: 8, value: 4},
  {x: 12, y: 7, value: 4},
  {x: 12, y: 6, value: 4},
  {x: 12, y: 5, value: 4},
  //
  {x: 13, y: 11, value: 4},
  {x: 13, y: 10, value: 4},
  //
  {x: 14, y: 11, value: 4},
  {x: 14, y: 10, value: 4},


  // 0
  {x: 5, y: 22, value: 0},
  {x: 5, y: 21, value: 0},
  {x: 5, y: 20, value: 0},
  {x: 5, y: 19, value: 0},
  {x: 5, y: 18, value: 0},
  {x: 5, y: 17, value: 0},
  //
  {x: 6, y: 23, value: 0},
  {x: 6, y: 22, value: 0},
  {x: 6, y: 21, value: 0},
  {x: 6, y: 20, value: 0},
  {x: 6, y: 19, value: 0},
  {x: 6, y: 18, value: 0},
  {x: 6, y: 17, value: 0},
  {x: 6, y: 16, value: 0},
  //
  {x: 7, y: 23, value: 0},
  {x: 7, y: 22, value: 0},
  {x: 7, y: 17, value: 0},
  {x: 7, y: 16, value: 0},
  //
  {x: 8, y: 23, value: 0},
  {x: 8, y: 22, value: 0},
  {x: 8, y: 17, value: 0},
  {x: 8, y: 16, value: 0},
  //
  {x: 9, y: 23, value: 0},
  {x: 9, y: 22, value: 0},
  {x: 9, y: 17, value: 0},
  {x: 9, y: 16, value: 0}, 
  //
  {x: 10, y: 23, value: 0},
  {x: 10, y: 22, value: 0},
  {x: 10, y: 17, value: 0},
  {x: 10, y: 16, value: 0}, 
  //
  {x: 11, y: 23, value: 0},
  {x: 11, y: 22, value: 0},
  {x: 11, y: 17, value: 0},
  {x: 11, y: 16, value: 0},
  //
  {x: 12, y: 23, value: 0},
  {x: 12, y: 22, value: 0},
  {x: 12, y: 17, value: 0},
  {x: 12, y: 16, value: 0},
  //
  {x: 13, y: 23, value: 0},
  {x: 13, y: 22, value: 0},
  {x: 13, y: 21, value: 0},
  {x: 13, y: 20, value: 0},
  {x: 13, y: 19, value: 0},
  {x: 13, y: 18, value: 0},
  {x: 13, y: 17, value: 0},
  {x: 13, y: 16, value: 0},
  //
  {x: 14, y: 22, value: 0},
  {x: 14, y: 21, value: 0},
  {x: 14, y: 20, value: 0},
  {x: 14, y: 19, value: 0},
  {x: 14, y: 18, value: 0},
  {x: 14, y: 17, value: 0},


  // 4
  {x: 5, y: 33, value: 4},
  {x: 5, y: 32, value: 4},
  {x: 5, y: 31, value: 4},
  //
  {x: 6, y: 33, value: 4},
  {x: 6, y: 32, value: 4},
  {x: 6, y: 31, value: 4},
  {x: 6, y: 30, value: 4},
  //
  {x: 7, y: 33, value: 4},
  {x: 7, y: 32, value: 4},
  {x: 7, y: 31, value: 4},
  {x: 7, y: 30, value: 4},
  {x: 7, y: 29, value: 4},
  //
  {x: 8, y: 33, value: 4},
  {x: 8, y: 32, value: 4},
  {x: 8, y: 30, value: 4},
  {x: 8, y: 29, value: 4},
  {x: 8, y: 28, value: 4},
  //
  {x: 9, y: 33, value: 4},
  {x: 9, y: 32, value: 4},
  {x: 9, y: 29, value: 4},
  {x: 9, y: 28, value: 4},
  {x: 9, y: 27, value: 4},
  //
  {x: 10, y: 33, value: 4},
  {x: 10, y: 32, value: 4},
  {x: 10, y: 28, value: 4},
  {x: 10, y: 27, value: 4},
  //
  {x: 11, y: 34, value: 4},
  {x: 11, y: 33, value: 4},
  {x: 11, y: 32, value: 4},
  {x: 11, y: 31, value: 4},
  {x: 11, y: 30, value: 4},
  {x: 11, y: 29, value: 4},
  {x: 11, y: 28, value: 4},
  {x: 11, y: 27, value: 4},
  //
  {x: 12, y: 34, value: 4},
  {x: 12, y: 33, value: 4},
  {x: 12, y: 32, value: 4},
  {x: 12, y: 31, value: 4},
  {x: 12, y: 30, value: 4},
  {x: 12, y: 29, value: 4},
  {x: 12, y: 28, value: 4},
  {x: 12, y: 27, value: 4},
  //
  {x: 13, y: 33, value: 4},
  {x: 13, y: 32, value: 4},
  //
  {x: 14, y: 33, value: 4},
  {x: 14, y: 32, value: 4},

]
export default DATA

