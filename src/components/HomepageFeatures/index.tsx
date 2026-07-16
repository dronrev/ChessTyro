import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  glyph: string;
  to: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Learn the Rules',
    glyph: '♟',
    to: '/docs/chess-rules/overview',
    description: (
      <>
        Start from zero: the board, how every piece moves, special moves like
        castling and en passant, and how games are won or drawn.
      </>
    ),
  },
  {
    title: 'Master Tactics',
    glyph: '♞',
    to: '/docs/chess-rules/tactics',
    description: (
      <>
        Spot the patterns that win games — forks, pins, and skewers — plus the
        basic checkmates every player needs to know.
      </>
    ),
  },
  {
    title: 'Play with a Plan',
    glyph: '♛',
    to: '/docs/chess-rules/basic-strategy',
    description: (
      <>
        Learn sound opening principles and simple strategy so you make purposeful
        moves instead of random ones.
      </>
    ),
  },
];

function Feature({title, glyph, to, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <span className={styles.featureGlyph} role="img" aria-label={title}>
          {glyph}
        </span>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
        <Link className="button button--primary" to={to}>
          Read more
        </Link>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
