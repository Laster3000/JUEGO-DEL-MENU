'use strict';
/* Accepted AI source, syntax-only transform with provenance. */
window.FUJU_FACTORY_AI_GATE = (() => {
const starts = [0, 2, 4, 7, 10, 12, 15, 17];
const lengths = [2, 2, 3, 3, 2, 3, 2, 2];

function requiredMask(chapter) {
  const start = starts[chapter - 1];
  const length = lengths[chapter - 1];
  return ((1 << length) - 1) << start;
}



function chapterCleared(chapter, solvedMask) {
  if (!Number.isInteger(chapter) || chapter < 1 || chapter > 8 || !Number.isInteger(solvedMask) || solvedMask < 0) return false;
  const required = requiredMask(chapter);
  return (required & solvedMask) === required;
}

return Object.freeze({chapterCleared});
})();
