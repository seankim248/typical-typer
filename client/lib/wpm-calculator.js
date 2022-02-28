export default function calculateWPM(startTime, endTime, chars, finished, currentIndex) {
  if (endTime) {
    const delta = endTime - startTime;
    const seconds = delta / 1000;
    if (finished) {
      const numberOfChars = chars.length;
      const wps = numberOfChars / seconds;
      const wpm = Math.round((wps * 60) / 5);
      return wpm;
    } else if (!finished) {
      const numberOfTypedChars = currentIndex;
      const wps = numberOfTypedChars / seconds;
      const wpm = Math.round((wps * 60.0) / 5);
      return wpm;
    }
  } else {
    return '';
  }
}
