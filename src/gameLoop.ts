export const gameLoopFactory = (render: () => void) => {
  let prevTimeStamp: number = 0;
  let secondsPassed;

  function gameLoop(timeStamp: number) {
    secondsPassed = (timeStamp - prevTimeStamp) / 1000;
    prevTimeStamp = timeStamp;
    console.log('secondsPassed: ', secondsPassed);

    render();
    window.requestAnimationFrame(gameLoop);
  };

  return gameLoop;
}
