import { I } from "../icons";
import { SUGGESTIONS } from "../data";
import type { Dialect } from "../types";

type Props = {
  level: string;
  dialect: Dialect;
  onStart: (prompt?: string) => void;
};

export function Landing({ onStart, level, dialect }: Props) {
  return (
    <div className="shell narrow fade-in" data-screen-label="01 Landing">
      <div className="eyebrow">
        <span className="dot" />¡Hola! · Ready when you are
      </div>
      <h1 className="display">
        Practice Spanish
        <br />
        by actually <span className="accent">speaking it</span>.
      </h1>
      <p className="lead mt-24">
        Drop in a topic or a list of questions. Habla turns it into a conversation — you answer out
        loud or by typing, and get specific, kind feedback after each one.
      </p>

      <div className="row gap-12 mt-32">
        <button className="btn primary lg" onClick={() => onStart()}>
          Start a session
          <I.Arrow size={15} />
        </button>
        <button className="btn lg ghost" onClick={() => onStart()}>
          <I.Spark size={15} /> See how it works
        </button>
        <span className="chip" style={{ marginLeft: "auto" }}>
          <span className="dot" /> {level} · {dialect === "es" ? "Castellano" : "Latinoamericano"}
        </span>
      </div>

      <div className="mt-40">
        <div className="eyebrow">Try a starter</div>
        <div className="suggest-grid">
          {SUGGESTIONS.map((s, i) => {
            const Ico = I[s.icon];
            return (
              <button key={i} className="suggest" onClick={() => onStart(s.prompt)}>
                <span className="ico-wrap">
                  <Ico size={15} />
                </span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
