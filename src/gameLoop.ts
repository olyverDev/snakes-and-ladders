export type LoopCallbackFunctionType = (delta: number) => void;
export const gameLoopFactory = (callbacks: LoopCallbackFunctionType[] = []) => {
  let prevTimeStamp: number = 0;
  const framerate = 1000 / 60;

  function gameLoop(timeStamp: number) {
    if (timeStamp >= prevTimeStamp + framerate) {
      callbacks.forEach((callback) => callback(timeStamp - prevTimeStamp));
      prevTimeStamp = timeStamp;
    }

    window.requestAnimationFrame(gameLoop);
  }

  return gameLoop;
};
