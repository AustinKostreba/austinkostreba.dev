import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { StoneRings } from "./components/StoneRings";

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => ViewTransition;
};

type ViewTransition = {
  finished: Promise<void>;
  skipTransition: () => void;
};

export default function App() {
  const [isNight, setIsNight] = useState(false);
  const switchRef = useRef<HTMLButtonElement>(null);
  const transitionRef = useRef<ViewTransition | null>(null);

  useEffect(() => {
    document.documentElement.dataset.shift = isNight ? "night" : "day";
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", isNight ? "#17151c" : "#f7ecda");
    return () => {
      delete document.documentElement.dataset.shift;
    };
  }, [isNight]);

  const changeShift = () => {
    const next = !isNight;
    const transitionDocument = document as ViewTransitionDocument;
    const bounds = switchRef.current?.getBoundingClientRect();
    if (bounds) {
      document.documentElement.style.setProperty(
        "--shift-x",
        `${bounds.left + bounds.width / 2}px`,
      );
      document.documentElement.style.setProperty(
        "--shift-y",
        `${bounds.top + bounds.height / 2}px`,
      );
    }
    const commitShift = () =>
      flushSync(() => {
        document.documentElement.dataset.shift = next ? "night" : "day";
        setIsNight(next);
      });
    if (
      !matchMedia("(prefers-reduced-motion: reduce)").matches &&
      transitionDocument.startViewTransition
    ) {
      transitionRef.current?.skipTransition();
      const transition = transitionDocument.startViewTransition(commitShift);
      transitionRef.current = transition;
      transition.finished
        .catch(() => {})
        .finally(() => {
          if (transitionRef.current === transition) transitionRef.current = null;
        });
    } else commitShift();
  };

  return (
    <main className="comp-frame" data-shift={isNight ? "night" : "day"}>
      <figure className="stone-artwork" aria-hidden="true">
        <StoneRings />
      </figure>
      <div className="introduction">
        <button
          ref={switchRef}
          className="shift-switch"
          type="button"
          role="switch"
          aria-checked={isNight}
          aria-label={`Switch to ${isNight ? "day" : "night"} job`}
          onClick={changeShift}
        >
          <span className="shift-label">Day</span>
          <span className="shift-track" aria-hidden="true">
            <span className="shift-indicator" />
          </span>
          <span className="shift-label">Night</span>
        </button>
        <h1>Austin Kostreba</h1>
        <div className="shift-copy" aria-live="polite">
          <p className="role">
            {isNight
              ? "Paid-on-call firefighter at West Metro Fire-Rescue District."
              : "Software engineering manager at Renaissance."}
          </p>
          <p className="current-work">
            {isNight ? (
              <>
                On nights and weekends, I respond to emergencies
                <br className="desktop-break" /> in New Hope and Crystal.
              </>
            ) : (
              <>
                I work on software that helps educators
                <br className="desktop-break" /> understand student needs and
                coordinate support.
              </>
            )}
          </p>
          {!isNight && (
            <p className="history">
              <>
                Previously at cmERDC. University of Minnesota
                <br className="desktop-break" /> Twin Cities.
              </>
            </p>
          )}
        </div>
        <a
          className="profile-link"
          href={
            isNight
              ? "https://www.wmfrd.org/"
              : "https://www.linkedin.com/in/austinkostreba/"
          }
          target="_blank"
          rel="noreferrer"
        >
          {isNight ? "West Metro Fire-Rescue" : "LinkedIn"}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </main>
  );
}
