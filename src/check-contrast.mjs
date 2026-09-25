import { readFileSync } from 'node:fs';

const tokens = JSON.parse(readFileSync(new URL('./design-tokens.json', import.meta.url)));

function token(path) {
  return path.split('.').reduce((value, part) => value[part], tokens).$value;
}

function luminance(hex) {
  const channels = hex.match(/[a-f\d]{2}/gi).map((value) => parseInt(value, 16) / 255);
  const linear = channels.map((value) => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return .2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2];
}

function contrast(foreground, background) {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + .05) / (darker + .05);
}

const pairs = [
  ['text.dark', 'ink.950', 4.5],
  ['muted.dark', 'ink.950', 4.5],
  ['violet.500', 'ink.950', 4.5],
  ['blue.500', 'ink.950', 4.5],
  ['ink.950', 'blue.500', 4.5],
  ['violet.800', 'paper.50', 4.5],
  ['blue.800', 'paper.50', 4.5],
  ['text.light', 'paper.50', 4.5],
  ['muted.light', 'paper.50', 4.5],
  ['text.light', 'paper.100', 4.5],
  ['muted.light', 'paper.100', 4.5],
  ['text.light', 'paper.warm', 4.5],
  ['muted.light', 'paper.warm', 4.5],
  ['feedback.error', 'paper.warm', 4.5],
  ['feedback.success', 'paper.warm', 4.5]
];

let failed = false;
for (const [foreground, background, minimum] of pairs) {
  const ratio = contrast(token(`color.${foreground}`), token(`color.${background}`));
  console.log(`${foreground} on ${background}: ${ratio.toFixed(2)}:1`);
  if (ratio < minimum) failed = true;
}

if (failed) process.exitCode = 1;
