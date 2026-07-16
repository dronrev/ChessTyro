import type {ReactNode} from 'react';
import styles from './styles.module.css';

// Unicode glyphs for each piece. Uppercase = white, lowercase = black,
// matching Forsyth–Edwards Notation (FEN).
const GLYPHS: Record<string, string> = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟',
};

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

type ChessBoardProps = {
  /** Piece-placement portion of a FEN string. Defaults to the starting position. */
  fen?: string;
  /** Show file (a–h) and rank (1–8) labels around the board. */
  coordinates?: boolean;
};

// Expand the piece-placement field of a FEN string into 64 cells (rank 8 → 1).
function parseFen(fen: string): string[] {
  const cells: string[] = [];
  for (const row of fen.split(' ')[0].split('/')) {
    for (const ch of row) {
      if (/\d/.test(ch)) {
        cells.push(...Array(Number(ch)).fill(''));
      } else {
        cells.push(ch);
      }
    }
  }
  return cells;
}

export default function ChessBoard({
  fen = STARTING_FEN,
  coordinates = true,
}: ChessBoardProps): ReactNode {
  const cells = parseFen(fen);

  return (
    <div className={styles.wrapper}>
      <div className={styles.board} role="img" aria-label="Chess board">
        {cells.map((piece, i) => {
          const file = i % 8;
          const rank = Math.floor(i / 8);
          const isLight = (file + rank) % 2 === 0;
          return (
            <div
              key={i}
              className={isLight ? styles.light : styles.dark}>
              {coordinates && file === 0 && (
                <span className={styles.rankLabel}>{8 - rank}</span>
              )}
              {coordinates && rank === 7 && (
                <span className={styles.fileLabel}>{FILES[file]}</span>
              )}
              {piece && (
                <span
                  className={styles.piece}
                  aria-label={piece === piece.toUpperCase() ? 'white' : 'black'}>
                  {GLYPHS[piece]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
