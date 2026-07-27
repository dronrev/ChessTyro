import {useRef, useState, useCallback, useId} from 'react';
import type {CSSProperties} from 'react';
import {Chess} from 'chess.js';
import {Chessboard} from 'react-chessboard';
import type {PieceDropHandlerArgs, SquareHandlerArgs} from 'react-chessboard';
import ChessBoard from '@site/src/components/ChessBoard';
import type {InteractiveBoardProps} from './index';
import styles from './styles.module.css';

// Accept either a full FEN or just the piece-placement field (like the static
// <ChessBoard>). A placement-only string is completed into a valid FEN.
function toFullFen(fen: string | undefined, turn: 'w' | 'b'): string | undefined {
  if (!fen) return undefined; // default starting position
  const trimmed = fen.trim();
  return trimmed.includes(' ') ? trimmed : `${trimmed} ${turn} - - 0 1`;
}

function createGame(fen: string | undefined): Chess | null {
  try {
    return new Chess(fen || undefined);
  } catch {
    return null; // illegal position (e.g. a diagram with no kings)
  }
}

// A square is "selectable" if it holds a piece of the side to move.
function canSelect(game: Chess, square: string): boolean {
  const piece = game.get(square as never);
  return Boolean(piece && piece.color === game.turn());
}

// Real interactive board - only rendered in the browser (see index.tsx).
export default function Board({
  fen,
  orientation = 'white',
  turn = 'w',
  highlight,
}: InteractiveBoardProps) {
  const gameRef = useRef(createGame(toFullFen(fen, turn)));
  const id = useId();

  // The piece whose moves are currently shown (dots on its target squares).
  const initialSelected = () => {
    const g = gameRef.current;
    return g && highlight && canSelect(g, highlight) ? highlight : null;
  };
  const [position, setPosition] = useState(gameRef.current?.fen() ?? '');
  const [selected, setSelected] = useState<string | null>(initialSelected);

  const onPieceDrop = useCallback(
    ({sourceSquare, targetSquare}: PieceDropHandlerArgs) => {
      const game = gameRef.current;
      if (!game || !targetSquare) return false;
      try {
        game.move({from: sourceSquare, to: targetSquare, promotion: 'q'});
      } catch {
        return false; // illegal move - snap the piece back
      }
      setPosition(game.fen());
      setSelected(null);
      return true;
    },
    [],
  );

  // Click a piece to reveal its legal moves; click a highlighted square to move.
  const onSquareClick = useCallback(
    ({square}: SquareHandlerArgs) => {
      const game = gameRef.current;
      if (!game || !square) return;
      if (selected) {
        const isTarget = game
          .moves({square: selected as never, verbose: true})
          .some((m) => m.to === square);
        if (isTarget) {
          try {
            game.move({from: selected, to: square, promotion: 'q'});
            setPosition(game.fen());
          } catch {
            /* ignore */
          }
          setSelected(null);
          return;
        }
      }
      setSelected(canSelect(game, square) ? square : null);
    },
    [selected],
  );

  const reset = useCallback(() => {
    gameRef.current = createGame(toFullFen(fen, turn));
    setPosition(gameRef.current?.fen() ?? '');
    setSelected(initialSelected());
  }, [fen, turn, highlight]);

  const undo = useCallback(() => {
    gameRef.current?.undo();
    setPosition(gameRef.current?.fen() ?? '');
    setSelected(null);
  }, []);

  // Illegal position for the rules engine → show a read-only static board.
  if (!gameRef.current) {
    return <ChessBoard fen={fen} />;
  }

  const game = gameRef.current;

  // Build the move-hint highlighting for the selected piece.
  const squareStyles: Record<string, CSSProperties> = {};
  if (selected) {
    squareStyles[selected] = {background: 'rgba(255, 214, 0, 0.45)'};
    for (const m of game.moves({square: selected as never, verbose: true})) {
      const isCapture = m.flags.includes('c') || m.flags.includes('e');
      squareStyles[m.to] = isCapture
        ? {
            background:
              'radial-gradient(circle, transparent 56%, rgba(20, 85, 30, 0.5) 58%)',
          }
        : {
            background:
              'radial-gradient(circle, rgba(20, 85, 30, 0.5) 26%, transparent 28%)',
            borderRadius: '50%',
          };
    }
  }

  let status: string;
  if (game.isCheckmate()) {
    status = `Checkmate - ${game.turn() === 'w' ? 'Black' : 'White'} wins`;
  } else if (game.isStalemate()) {
    status = 'Draw - stalemate';
  } else if (game.isDraw()) {
    status = 'Draw';
  } else {
    status = `${game.turn() === 'w' ? 'White' : 'Black'} to move${
      game.isCheck() ? ' - check!' : ''
    }`;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.board}>
        <Chessboard
          options={{
            id,
            position,
            onPieceDrop,
            onSquareClick,
            squareStyles,
            boardOrientation: orientation,
            darkSquareStyle: {backgroundColor: '#b58863'},
            lightSquareStyle: {backgroundColor: '#f0d9b5'},
          }}
        />
      </div>
      <div className={styles.status}>{status}</div>
      <div className={styles.controls}>
        <button className="button button--secondary button--sm" onClick={undo}>
          Undo
        </button>
        <button className="button button--primary button--sm" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}
