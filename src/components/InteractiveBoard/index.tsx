import type {ReactNode} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './styles.module.css';

export type InteractiveBoardProps = {
  /**
   * Starting position. Either a full FEN, or just the piece-placement field
   * (like the static <ChessBoard>), which is completed automatically. Defaults
   * to the initial position. An illegal position falls back to a static board.
   */
  fen?: string;
  /** Which side sits at the bottom. */
  orientation?: 'white' | 'black';
  /** Side to move when a placement-only FEN is given. Defaults to White. */
  turn?: 'w' | 'b';
  /**
   * A square (e.g. "d4") to pre-select on load, showing that piece's legal
   * moves as dots. Handy for demonstrating how a piece moves.
   */
  highlight?: string;
};

// react-chessboard and chess.js touch browser APIs, so the real board is loaded
// only in the browser via <BrowserOnly>. This keeps the static build (SSR) working.
export default function InteractiveBoard(props: InteractiveBoardProps): ReactNode {
  return (
    <BrowserOnly
      fallback={<div className={styles.wrapper}>Loading board…</div>}>
      {() => {
        const Board = require('./Board').default;
        return <Board {...props} />;
      }}
    </BrowserOnly>
  );
}
