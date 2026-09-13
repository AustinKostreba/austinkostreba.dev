import { StoneRings } from './components/StoneRings'

export default function App() {
  return (
    <main className="comp-frame">
      <figure className="stone-artwork" aria-hidden="true">
        <StoneRings />
      </figure>

      <div className="introduction">
        <h1>Austin Kostreba</h1>
        <p className="role">Software engineering manager at Renaissance.</p>
        <p className="current-work">
          I work on software that helps educators
          <br className="desktop-break" /> understand student needs and
          coordinate support.
        </p>
        <p className="history">
          Previously at cmERDC. University of Minnesota
          <br className="desktop-break" /> Twin Cities.
        </p>
        <a
          className="linkedin"
          href="https://www.linkedin.com/in/austinkostreba/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </main>
  )
}
