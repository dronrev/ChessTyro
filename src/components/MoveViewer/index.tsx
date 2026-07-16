import type {ReactNode} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './styles.module.css';

export type MoveViewerProps = {
  /**
   * The moves to replay, in algebraic notation (SAN). Move numbers, dots, and a
   * result token are ignored, so you can paste a line like
   * "1. e4 e5 2. Nf3 Nc6 3. Bc4" directly.
   */
  moves: string;
  /** Full FEN to start from. Defaults to the initial position. */
  startFen?: string;
  /** Which side sits at the bottom. */
  orientation?: 'white' | 'black';
};

// react-chessboard and chess.js touch browser APIs, so the real viewer is loaded
// only in the browser via <BrowserOnly>, keeping the static build (SSR) working.
export default function MoveViewer(props: MoveViewerProps): ReactNode {
  return (
    <BrowserOnly
      fallback={<div className={styles.wrapper}>Loading board…</div>}>
      {() => {
        const Viewer = require('./Viewer').default;
        return <Viewer {...props} />;
      }}
    </BrowserOnly>
  );
}
