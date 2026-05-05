export default function Rosco({
  letters,
  letterStates,
  currentIndex,
  setCurrentIndex,
}) {
  return (
    <div className="rosco">
      {letters.map((l, i) => {
        const angle = (2 * Math.PI * i) / letters.length - Math.PI / 2;
        const x = 50 + 45 * Math.cos(angle);
        const y = 50 + 45 * Math.sin(angle);

        return (
          <button
            key={l}
            className={`rosco-letter ${letterStates[l]} ${
              i === currentIndex ? "active" : ""
            }`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
            }}
            aria-label={`Letra ${l}`}
            type="button"
            onClick={() => setCurrentIndex(i)}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
