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

// API отдаёт картинки очень разного размера: от 163x227 у Гаррі до 960x1280
// у Артура Візлі, а слот в карточке 298px — на retina нужно около 600.
// Просим CDN отдать ровно эту ширину с резкостью: крупные уменьшатся и не будут
// тянуть лишние сотни килобайт, мелкие станут чище на вид.
// Детали это не добавит — у мелких мастер и правда маленький, лучше его нет.
// CDN сам отдаёт WebP браузерам, которые его принимают: ~55КБ вместо ~100КБ JPEG.
function imageUrl(src) {
  if (!src.includes("ik.imagekit.io")) {
    return src; // чужой хост — параметры трогать нельзя
  }
  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}tr=w-600,q-75,e-sharpen-1`;
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
    image.src = imageUrl(character.image);
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
