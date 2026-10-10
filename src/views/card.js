import "./card.css";

function addLine(parent, className, text) {
  if (!text) {
    return; // пустые строки не рисуем вообще — у большинства персонажей данных нет
  }
  const p = document.createElement("p");
  p.className = className;
  p.textContent = text;
  parent.append(p);
}

export function createCard(character) {
  const item = document.createElement("li");
  item.className = "card";
  item.dataset.id = character.id;

  const photo = document.createElement("div");
  photo.className = "card__photo";

  // Фото есть только у 25 персонажей из 437. Если ссылки нет — <img> не создаём
  // совсем: пустой src ушёл бы запросом и дал 404 в консоли, а onerror тут не спасает,
  // он срабатывает уже после того, как ошибка записана.
  if (character.image) {
    const image = document.createElement("img");
    image.className = "card__image";
    image.src = character.image;
    image.alt = character.name;
    image.loading = "lazy";
    image.decoding = "async";
    photo.append(image);
  }

  const body = document.createElement("div");
  body.className = "card__body";

  addLine(body, "card__name", character.name);
  addLine(body, "card__meta", character.alternate_names?.[0]);
  addLine(body, "card__meta", character.house);
  addLine(body, "card__meta", character.dateOfBirth);

  const more = document.createElement("button");
  more.type = "button";
  more.className = "card__more";
  more.setAttribute("aria-expanded", "false");
  more.append("Більше інформації");

  const dot = document.createElement("span");
  dot.className = "card__dot";
  dot.setAttribute("aria-hidden", "true");
  more.append(dot);

  item.append(photo, body, more);
  return item;
}
