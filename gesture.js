function getGesture(lm) {
  let indexUp = lm[8].y < lm[6].y;
  let middleUp = lm[12].y < lm[10].y;
  let thumbUp = lm[4].y < lm[3].y;

  if (indexUp && !middleUp) return "draw";
  if (indexUp && middleUp) return "erase";
  if (thumbUp) return "pause";

  return "idle";
}
