import { test, expect } from '@playwright/test';

const GAME_URL = '/games/tic-tac-toe-hot-seat.html';

test.describe('Tic Tac Toe (Hot Seat) @tic-tac-toe @game', () => {
  test.describe('1. Smoke Test - Page Load @smoke', () => {
    test('should load the game page with all elements in initial state @smoke @page-load', async ({ page }) => {
      // Step 1: Navigate to the game URL
      await page.goto(GAME_URL);

      // Step 2: Check page title
      await expect(page).toHaveTitle('🦎 GAD | Game: Tic Tac Toe (Hot Seat)');

      // Step 3: Verify "Start New Game" button is visible and enabled
      const startButton = page.getByRole('button', { name: 'Start New Game' });
      await expect(startButton).toBeVisible();
      await expect(startButton).toBeEnabled();

      // Step 4: Verify status display shows "..."
      const status = page.getByRole('status');
      await expect(status).toHaveText('...');

      // Step 5: Verify Player X score is 0
      await expect(page.getByText('Player X: 0')).toBeVisible();

      // Step 6: Verify Player O score is 0
      await expect(page.getByText('Player O: 0')).toBeVisible();

      // Step 7: Verify game board - all 9 cells are empty
      const board = page.getByRole('grid', { name: 'Tic Tac Toe board' });
      await expect(board).toBeVisible();

      const cells = board.getByRole('gridcell');
      await expect(cells).toHaveCount(9);

      // Verify all cells are empty (have "Empty cell" accessible name)
      for (let row = 1; row <= 3; row++) {
        for (let col = 1; col <= 3; col++) {
          const cell = page.getByRole('gridcell', { name: `Empty cell, row ${row}, column ${col}` });
          await expect(cell).toBeVisible();
        }
      }
    });
  });

  test.describe('2. Gameplay - X Wins (Top Row) @gameplay', () => {
    test('should allow Player X to win by completing the top row @gameplay @x-wins', async ({ page }) => {
      await page.goto(GAME_URL);

      const startButton = page.getByRole('button', { name: 'Start New Game' });
      const status = page.getByRole('status');
      const board = page.getByRole('grid', { name: 'Tic Tac Toe board' });

      // Helper function to click a cell by row and column
      const clickCell = async (row: number, col: number) => {
        await board.getByRole('gridcell', { name: `Empty cell, row ${row}, column ${col}` }).click();
      };

      // Step 1: Click "Start New Game" - Button becomes disabled, status shows "X's turn"
      await startButton.click();
      await expect(startButton).toBeDisabled();
      await expect(status).toHaveText("X's turn");

      // Step 2: X clicks cell (1,1) - Cell shows "X", status shows "O's turn"
      await clickCell(1, 1);
      await expect(board.getByRole('gridcell', { name: 'Empty cell, row 1, column 1' })).toHaveText('X');
      await expect(status).toHaveText("O's turn");

      // Step 3: O clicks cell (2,1) - Cell shows "O", status shows "X's turn"
      await clickCell(2, 1);
      await expect(board.getByRole('gridcell', { name: 'Empty cell, row 2, column 1' })).toHaveText('O');
      await expect(status).toHaveText("X's turn");

      // Step 4: X clicks cell (1,2) - Cell shows "X", status shows "O's turn"
      await clickCell(1, 2);
      await expect(board.getByRole('gridcell', { name: 'Empty cell, row 1, column 2' })).toHaveText('X');
      await expect(status).toHaveText("O's turn");

      // Step 5: O clicks cell (2,2) - Cell shows "O", status shows "X's turn"
      await clickCell(2, 2);
      await expect(board.getByRole('gridcell', { name: 'Empty cell, row 2, column 2' })).toHaveText('O');
      await expect(status).toHaveText("X's turn");

      // Step 6: X clicks cell (1,3) - X wins with top row
      await clickCell(1, 3);
      await expect(board.getByRole('gridcell', { name: 'Empty cell, row 1, column 3' })).toHaveText('X');

      // Step 7: Verify end state - Player X score is 1, status shows "Click start to play again", button is enabled
      await expect(page.getByText('Player X: 1')).toBeVisible();
      await expect(status).toHaveText('Click start to play again');
      await expect(startButton).toBeEnabled();
    });
  });
});
