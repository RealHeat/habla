import { I } from "../icons";
import { LEVELS } from "../data";
import type { LevelId } from "../types";

type Props = {
  value: LevelId;
  onChange: (id: LevelId) => void;
  onContinue: () => void;
};

export function LevelSelect({ value, onChange, onContinue }: Props) {
  return (
    <div className="shell narrow fade-in" data-screen-label="02 Level">
      <div className="eyebrow">Step 1 of 3 · Calibrate</div>
      <h2 className="section mt-12">What level are you?</h2>
      <p className="lead mt-12">
        We'll tune vocabulary, grammar tense, and how forgiving feedback is. You can change this any
        time.
      </p>

      <div className="levels mt-32">
        {LEVELS.map((lv) => (
          <button
            key={lv.id}
            className="level"
            data-active={value === lv.id ? "1" : "0"}
            onClick={() => onChange(lv.id)}
          >
            <div className="level-code">{lv.code}</div>
            <div className="level-name">{lv.name}</div>
            <div className="level-desc">{lv.desc}</div>
            {lv.progress > 0 && (
              <div className="level-bar">
                <i style={{ width: `${lv.progress * 100}%` }} />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="row mt-32" style={{ justifyContent: "flex-end" }}>
        <button className="btn primary lg" onClick={onContinue}>
          Continue
          <I.Arrow size={15} />
        </button>
      </div>
    </div>
  );
}
