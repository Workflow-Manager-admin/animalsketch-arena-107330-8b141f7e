const pastelBgColors = [
  "bg-pastelBlue",
  "bg-pastelYellow",
  "bg-pastelPink",
  "bg-pastelPurple",
  "bg-pastelGreen"
];

export function getRandomPastelBg() {
  return pastelBgColors[Math.floor(Math.random() * pastelBgColors.length)];
}
