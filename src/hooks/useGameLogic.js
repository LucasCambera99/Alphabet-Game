import { useCallback, useEffect, useMemo, useState } from "react";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const DEFAULT_TIME = 120;

export default function useGameLogic() {
  const [time, setTime] = useState(DEFAULT_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [letterStates, setLetterStates] = useState(
    Object.fromEntries(LETTERS.map((l) => [l, "neutral"]))
  );
  const [isReviewingSkipped, setIsReviewingSkipped] = useState(false);
  const [teamName, setTeamName] = useState("Grupo 1");

  const correctCount = useMemo(
    () => Object.values(letterStates).filter((state) => state === "correct").length,
    [letterStates]
  );
  const wrongCount = useMemo(
    () => Object.values(letterStates).filter((state) => state === "wrong").length,
    [letterStates]
  );

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          setIsRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const findNextSkippedIndex = useCallback((states, startIndex) => {
    for (let step = 1; step <= LETTERS.length; step += 1) {
      const nextIndex = (startIndex + step) % LETTERS.length;

      if (states[LETTERS[nextIndex]] === "skip") {
        return nextIndex;
      }
    }

    return -1;
  }, []);

  const goToNextLetter = useCallback((states) => {
    if (isReviewingSkipped) {
      const nextSkippedIndex = findNextSkippedIndex(states, currentIndex);

      if (nextSkippedIndex >= 0) {
        setCurrentIndex(nextSkippedIndex);
        return;
      }

      setIsRunning(false);
      return;
    }

    if (currentIndex < LETTERS.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return;
    }

    setIsReviewingSkipped(true);

    const firstSkippedIndex = LETTERS.findIndex((letter) => states[letter] === "skip");

    if (firstSkippedIndex >= 0) {
      setCurrentIndex(firstSkippedIndex);
      return;
    }

    setIsRunning(false);
  }, [currentIndex, findNextSkippedIndex, isReviewingSkipped]);

  const markLetter = useCallback((type) => {
    const letter = LETTERS[currentIndex];
    const updatedStates = { ...letterStates, [letter]: type };

    setLetterStates(updatedStates);

    goToNextLetter(updatedStates);

    if (type !== "correct") {
      setIsRunning(false);
    }
  }, [currentIndex, goToNextLetter, letterStates]);

  const resetGame = () => {
    setTime(DEFAULT_TIME);
    setIsRunning(false);
    setCurrentIndex(0);
    setIsReviewingSkipped(false);
    setLetterStates(Object.fromEntries(LETTERS.map((l) => [l, "neutral"])));
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsRunning((r) => !r);
      }

      if (e.key === "a") markLetter("correct");
      if (e.key === "s") markLetter("wrong");
      if (e.key === "d") markLetter("skip");
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [markLetter]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const addTime = (seconds) => {
    setTime((t) => Math.max(0, t + seconds));
  };

  const setExactTime = (seconds) => {
    setTime(Math.max(0, seconds));
  };

  return {
    LETTERS,
    time,
    isRunning,
    currentIndex,
    letterStates,
    correctCount,
    wrongCount,
    teamName,
    setTeamName,
    setIsRunning,
    setCurrentIndex,
    markLetter,
    resetGame,
    toggleFullscreen,
    addTime,
    setExactTime,
  };
}
