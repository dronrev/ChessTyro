import {useState, useEffect, useMemo, useId, useCallback} from 'react';
import {Chess} from 'chess.js';
import {Chessboard} from 'react-chessboard';
import type {MoveViewerProps} from './index';
import styles from './styles.module.css';

type Ply = {san: string | null; fen: string};

// Replay the SAN moves and record the FEN after each one. Move numbers, dots and
// a result token are stripped so a pasted line "1. e4 e5 2. Nf3" works directly.
function buildPositions(moves: string, startFen?: string): Ply[] {
  const game = new Chess(startFen || undefined);
  const positions: Ply[] = [{san: null, fen: game.fen()}];
  const cleaned = moves
    .replace(/\d+\.(\.\.)?/g, ' ') // move numbers: "1." / "1..."
    .replace(/(1-0|0-1|1\/2-1\/2|½-½|\*)/g, ' '); // results
  for (const token of cleaned.split(/\s+/).filter(Boolean)) {
    try {
      const m = game.move(token);
      positions.push({san: m.san, fen: game.fen()});
    } catch {
      break; // stop at the first token that isn't a legal move
    }
  }
  return positions;
}

export default function Viewer({
  moves,
  startFen,
  orientation = 'white',
}: MoveViewerProps) {
  const positions = useMemo(
    () => buildPositions(moves, startFen),
    [moves, startFen],
  );
  const last = positions.length - 1;
  const [ply, setPly] = useState(0);
  const [playing, setPlaying] = useState(false);
  const id = useId();

  const go = useCallback(
    (n: number) => setPly(Math.max(0, Math.min(last, n))),
    [last],
  );

  // Autoplay: advance one move roughly every second, then stop at the end.
  useEffect(() => {
    if (!playing) return undefined;
    if (ply >= last) {
      setPlaying(false);
      return undefined;
    }
    const timer = setTimeout(() => setPly((p) => Math.min(last, p + 1)), 1000);
    return () => clearTimeout(timer);
  }, [playing, ply, last]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.board}>
        <Chessboard
          options={{
            id,
            position: positions[ply].fen,
            allowDragging: false,
            animationDurationInMs: 250,
            boardOrientation: orientation,
            darkSquareStyle: {backgroundColor: '#b58863'},
            lightSquareStyle: {backgroundColor: '#f0d9b5'},
          }}
        />
      </div>

      <div className={styles.controls}>
        <button className="button button--secondary button--sm"
          onClick={() => {setPlaying(false); go(0);}} disabled={ply === 0}
          aria-label="First move">⏮</button>
        <button className="button button--secondary button--sm"
          onClick={() => {setPlaying(false); go(ply - 1);}} disabled={ply === 0}
          aria-label="Previous move">◀</button>
        <button className="button button--primary button--sm"
          onClick={() => setPlaying((p) => !p)} disabled={ply >= last}>
          {playing ? '⏸ Pause' : '▶ Play'}</button>
        <button className="button button--secondary button--sm"
          onClick={() => {setPlaying(false); go(ply + 1);}} disabled={ply >= last}
          aria-label="Next move">▶</button>
        <button className="button button--secondary button--sm"
          onClick={() => {setPlaying(false); go(last);}} disabled={ply >= last}
          aria-label="Last move">⏭</button>
      </div>

      <ol className={styles.moves}>
        {positions.slice(1).map((p, i) => {
          const plyIndex = i + 1;
          const isWhite = plyIndex % 2 === 1;
          return (
            <li key={plyIndex} className={styles.moveItem}>
              {isWhite && (
                <span className={styles.moveNum}>{(plyIndex + 1) / 2}.</span>
              )}
              <button
                className={
                  plyIndex === ply ? styles.moveActive : styles.moveBtn
                }
                onClick={() => {setPlaying(false); go(plyIndex);}}>
                {p.san}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
