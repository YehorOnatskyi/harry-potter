// Чистые функции: приводят сырые значения API к виду из макета.
// API отдаёт "half-blood", "male", true — макет показывает "Half-blood", "Male", "True".

export function capitalize(value) {
  if (typeof value !== "string" || value === "") {
    return "";
  }
  // Только первая буква: в макете "Half-blood", а не "Half-Blood".
  return value[0].toUpperCase() + value.slice(1);
}

export function formatBoolean(value) {
  if (typeof value !== "boolean") {
    return "";
  }
  return value ? "True" : "False";
}

export function formatList(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return "";
  }
  return values.join(", ");
}

export function formatWand(wand) {
  if (!wand) {
    return "";
  }

  const parts = [];
  if (wand.wood) parts.push(`Wood : ${wand.wood}`);
  if (wand.core) parts.push(`core : ${wand.core}`);
  if (wand.length) parts.push(`length : ${wand.length}`);

  return parts.join(", ");
}

export function formatNumber(value) {
  return typeof value === "number" ? String(value) : "";
}

// Порядок строк и подписи взяты из макета (узел 16-131).
// Подписи английские, потому что так в макете; опечатка "Gend" исправлена на "Gender".
const ROWS = [
  { label: "Name", get: (c) => c.name || "" },
  { label: "Alternate names", get: (c) => formatList(c.alternate_names) },
  { label: "Species", get: (c) => capitalize(c.species) },
  { label: "Gender", get: (c) => capitalize(c.gender) },
  { label: "House", get: (c) => capitalize(c.house) },
  { label: "Date of birth", get: (c) => c.dateOfBirth || "" },
  { label: "Year of birth", get: (c) => formatNumber(c.yearOfBirth) },
  { label: "Wizard", get: (c) => formatBoolean(c.wizard) },
  { label: "Ancestry", get: (c) => capitalize(c.ancestry) },
  { label: "Eye colour", get: (c) => capitalize(c.eyeColour) },
  { label: "Hair colour", get: (c) => capitalize(c.hairColour) },
  { label: "Wand", get: (c) => formatWand(c.wand) },
  { label: "Patronus", get: (c) => capitalize(c.patronus) },
  { label: "Hogwarts student", get: (c) => formatBoolean(c.hogwartsStudent) },
  { label: "Hogwarts staff", get: (c) => formatBoolean(c.hogwartsStaff) },
  { label: "Actor", get: (c) => c.actor || "" },
  { label: "Alive", get: (c) => formatBoolean(c.alive) },
];

export function characterRows(character) {
  return (
    ROWS.map((row) => ({ label: row.label, value: row.get(character) }))
      // Сравниваем именно с пустой строкой, а не на истинность:
      // иначе каждое False (Wizard, Alive, Hogwarts staff) молча исчезло бы.
      .filter((row) => row.value !== "")
  );
}
