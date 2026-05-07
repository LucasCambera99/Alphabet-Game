import useGameLogic from "./hooks/useGameLogic";
import Rosco from "./components/Rosco";
import "./styles/App.css";

export default function App() {
  const game = useGameLogic();
  const currentLetter = game.LETTERS[game.currentIndex];
  const minutes = Math.floor(game.time / 60);
  const seconds = String(game.time % 60).padStart(2, "0");

  return (
    <div className="app">
      <header className="topbar">
        <label className="field">
          Grupo
          <input
            value={game.teamName}
            onChange={(e) => game.setTeamName(e.target.value)}
            placeholder="Nombre del grupo"
          />
        </label>

        <div className="scoreboard" aria-label="Marcador">
          <span className="score correct">Aciertos: {game.correctCount}</span>
          <span className="score wrong">Errores: {game.wrongCount}</span>
        </div>
      </header>

      <main className="game-layout">
        <section className="stage" aria-label="Rosco">
          <Rosco
            letters={game.LETTERS}
            letterStates={game.letterStates}
            currentIndex={game.currentIndex}
            setCurrentIndex={game.setCurrentIndex}
          />

          <div className="center-panel">
            <p className="team-name">{game.teamName || "Grupo"}</p>
            <p className="timer" aria-live="polite">
              {minutes}:{seconds}
            </p>
            <p className="current-letter">Letra {currentLetter}</p>
          </div>
        </section>

        <aside className="controls" aria-label="Controles">
          <label className="field">
            Segundos
            <input
              type="number"
              min="0"
              value={game.time}
              onChange={(e) => game.setExactTime(Number(e.target.value) || 0)}
            />
          </label>

          <div className="button-grid">
            <button type="button" onClick={() => game.setIsRunning((r) => !r)}>
              {game.isRunning ? "Pausar" : "Reanudar"}
            </button>
            <button type="button" onClick={() => game.addTime(10)}>
              +10 s
            </button>
            <button type="button" onClick={() => game.addTime(-10)}>
              -10 s
            </button>
            <button type="button" onClick={game.resetGame}>
              Reiniciar
            </button>
          </div>

          <div className="actions">
            <button
              type="button"
              className="action correct"
              onClick={() => game.markLetter("correct")}
            >
              Acierto
              <kbd>A</kbd>
            </button>
            <button
              type="button"
              className="action wrong"
              onClick={() => game.markLetter("wrong")}
            >
              Error
              <kbd>S</kbd>
            </button>
            <button
              type="button"
              className="action skip"
              onClick={() => game.markLetter("skip")}
            >
              Pasapalabra
              <kbd>D</kbd>
            </button>
          </div>
        </aside>
      </main>

      <a
        className="linkedin-credit"
        href="https://linkedin.com/in/lucascambera/"
        target="_blank"
        rel="noreferrer"
        aria-label="LinkedIn de Lucas Cambera"
      >
        <span className="linkedin-logo" aria-hidden="true">
          in
        </span>
        linkedin.com/in/lucascambera/
      </a>
    </div>
  );
}
