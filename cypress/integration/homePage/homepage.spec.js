describe('visit Website', () => {
  it('home page', () => {
    cy.visit('/');
  });

  it('Maze game', () => {
    cy.visit('http://localhost:8080/#/maze');
    cy.visit('http://localhost:8080/#/maze/info');
  });

  it('Memoji game', () => {
    cy.visit('http://localhost:8080/#/memoji');
    cy.visit('http://localhost:8080/#/memoji/info');
  });

  it('Rock Paper Scissors game', () => {
    cy.visit('http://localhost:8080/#/rock-paper-scissors');
    cy.visit('http://localhost:8080/#/rock-paper-scissors/info');
  });

  it('Tic Tac Toe game', () => {
    cy.visit('http://localhost:8080/#/tic-tac-toe');
    cy.visit('http://localhost:8080/#/tic-tac-toe/info');
  });

  it('Chess game', () => {
    cy.visit('http://localhost:8080/#/chess');
    cy.visit('http://localhost:8080/#/chess/info');
  });
});