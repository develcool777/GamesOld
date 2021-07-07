import Pawn from '@/model/chess/figures/pawn'
import Rook from '@/model/chess/figures/rook'
import Bishop from '@/model/chess/figures/bishop'
import Queen from '@/model/chess/figures/queen'
import Knight from '@/model/chess/figures/knight'
import King from '@/model/chess/figures/king'

export default class Figures {
  constructor() {
    // if (typeof side !== 'string') {
    //   throw Error(`Figures.constructor side must be String`);
    // }
    // Object.defineProperties(this, {
    //   side: {
    //     get: () => side
    //   }
    // })
    this.whiteRook1 = new Rook('white', {x: 7, y: 0});
    this.whiteKnight1 = new Knight('white', {x: 7, y: 1});
    this.whiteBishop1 = new Bishop('white', {x: 7, y: 2});
    this.whiteQueen = new Queen('white', {x: 7, y: 3});
    this.whiteKing = new King('white', {x: 7, y: 4});
    this.whiteBishop2 = new Bishop('white', {x: 7, y: 5})
    this.whiteKnight2 = new Knight('white', {x: 7, y: 6});
    this.whiteRook2 = new Rook('white', {x: 7, y: 7});

    this.whitePawn1 = new Pawn('white', {x: 6, y: 0});
    this.whitePawn2 = new Pawn('white', {x: 6, y: 1});
    this.whitePawn3 = new Pawn('white', {x: 6, y: 2});
    this.whitePawn4 = new Pawn('white', {x: 6, y: 3});
    this.whitePawn5 = new Pawn('white', {x: 6, y: 4});
    this.whitePawn6 = new Pawn('white', {x: 6, y: 5});
    this.whitePawn7 = new Pawn('white', {x: 6, y: 6});
    this.whitePawn8 = new Pawn('white', {x: 6, y: 7});


    this.blackRook1 = new Rook('black', {x: 0, y: 0});
    this.blackKnight1 = new Knight('black', {x: 0, y: 1});
    this.blackBishop1 = new Bishop('black', {x: 0, y: 2});
    this.blackQueen = new Queen('black', {x: 0, y: 3});
    this.blackKing = new King('black', {x: 0, y: 4});
    this.blackBishop2 = new Bishop('black', {x: 0, y: 5})
    this.blackKnight2 = new Knight('black', {x: 0, y: 6});
    this.blackRook2 = new Rook('black', {x: 0, y: 7});

    this.blackPawn1 = new Pawn('black', {x: 1, y: 0});
    this.blackPawn2 = new Pawn('black', {x: 1, y: 1});
    this.blackPawn3 = new Pawn('black', {x: 1, y: 2});
    this.blackPawn4 = new Pawn('black', {x: 1, y: 3});
    this.blackPawn5 = new Pawn('black', {x: 1, y: 4});
    this.blackPawn6 = new Pawn('black', {x: 1, y: 5});
    this.blackPawn7 = new Pawn('black', {x: 1, y: 6});
    this.blackPawn8 = new Pawn('black', {x: 1, y: 7});
  }

  addFiguresToField(field) {
    field[this.whiteRook1.position.x][this.whiteRook1.position.y].figure = this.whiteRook1;
    field[this.whiteKnight1.position.x][this.whiteKnight1.position.y].figure = this.whiteKnight1;
    field[this.whiteBishop1.position.x][this.whiteBishop1.position.y].figure = this.whiteBishop1;
    field[this.whiteQueen.position.x][this.whiteQueen.position.y].figure = this.whiteQueen;
    field[this.whiteKing.position.x][this.whiteKing.position.y].figure = this.whiteKing;
    field[this.whiteBishop2.position.x][this.whiteBishop2.position.y].figure = this.whiteBishop2;
    field[this.whiteKnight2.position.x][this.whiteKnight2.position.y].figure = this.whiteKnight2;
    field[this.whiteRook2.position.x][this.whiteRook2.position.y].figure = this.whiteRook2;

    field[this.whitePawn1.position.x][this.whitePawn1.position.y].figure = this.whitePawn1;
    field[this.whitePawn2.position.x][this.whitePawn2.position.y].figure = this.whitePawn2;
    field[this.whitePawn3.position.x][this.whitePawn3.position.y].figure = this.whitePawn3;
    field[this.whitePawn4.position.x][this.whitePawn4.position.y].figure = this.whitePawn4;
    field[this.whitePawn5.position.x][this.whitePawn5.position.y].figure = this.whitePawn5;
    field[this.whitePawn6.position.x][this.whitePawn6.position.y].figure = this.whitePawn6;
    field[this.whitePawn7.position.x][this.whitePawn7.position.y].figure = this.whitePawn7;
    field[this.whitePawn8.position.x][this.whitePawn8.position.y].figure = this.whitePawn8;


    field[this.blackRook1.position.x][this.blackRook1.position.y].figure = this.blackRook1;
    field[this.blackKnight1.position.x][this.blackKnight1.position.y].figure = this.blackKnight1;
    field[this.blackBishop1.position.x][this.blackBishop1.position.y].figure = this.blackBishop1;
    field[this.blackQueen.position.x][this.blackQueen.position.y].figure = this.blackQueen;
    field[this.blackKing.position.x][this.blackKing.position.y].figure = this.blackKing;
    field[this.blackBishop2.position.x][this.blackBishop2.position.y].figure = this.blackBishop2;
    field[this.blackKnight2.position.x][this.blackKnight2.position.y].figure = this.blackKnight2;
    field[this.blackRook2.position.x][this.blackRook2.position.y].figure = this.blackRook2;

    field[this.blackPawn1.position.x][this.blackPawn1.position.y].figure = this.blackPawn1;
    field[this.blackPawn2.position.x][this.blackPawn2.position.y].figure = this.blackPawn2;
    field[this.blackPawn3.position.x][this.blackPawn3.position.y].figure = this.blackPawn3;
    field[this.blackPawn4.position.x][this.blackPawn4.position.y].figure = this.blackPawn4;
    field[this.blackPawn5.position.x][this.blackPawn5.position.y].figure = this.blackPawn5;
    field[this.blackPawn6.position.x][this.blackPawn6.position.y].figure = this.blackPawn6;
    field[this.blackPawn7.position.x][this.blackPawn7.position.y].figure = this.blackPawn7;
    field[this.blackPawn8.position.x][this.blackPawn8.position.y].figure = this.blackPawn8;
  }
  
}