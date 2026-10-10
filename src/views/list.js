import "./list.css";
import { createCard } from "./card.js";

const view = document.getElementById("view");

// Номер последнего запроса. Нужен против гонки: быстрый клик
// «студенти» → «співробітники» иначе даст студентам долететь последними
// и перетереть уже нарисованных сотрудников.
let currentRequest = 0;

// Список, который сейчас на экране. Из него панель ховера берёт персонажа по id.
let currentItems = [];

export function getCurrentItems() {
  return currentItems;
}

function renderShell(title, tabs) {
  view.replaceChildren();

  const back = document.createElement("a");
  back.className = "list__back";
  back.href = "#/";
  back.textContent = "← На головну";

  const heading = document.createElement("h1");
  heading.className = "list__title";
  heading.textContent = title;

  view.append(back, heading);

  if (tabs) {
    view.append(tabs);
  }

  const body = document.createElement("div");
  body.className = "list__body";
  view.append(body);

  return body;
}

function setStatus(body, text) {
  const status = document.createElement("p");
  status.className = "list__status";
  status.textContent = text;
  body.replaceChildren(status);
}

function renderError(body, retry) {
  const status = document.createElement("p");
  status.className = "list__status list__status--error";
  status.textContent =
    "Не вдалося завантажити персонажів. Перевірте з'єднання.";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "button";
  button.textContent = "Спробувати ще раз";
  button.addEventListener("click", retry);

  body.replaceChildren(status, button);
}

function renderCards(body, items) {
  const grid = document.createElement("ul");
  grid.className = "list__grid";
  grid.append(...items.map(createCard));
  body.replaceChildren(grid);
}

export async function showList({ title, loader, tabs }) {
  const myRequest = ++currentRequest;
  const body = renderShell(title, tabs);
  setStatus(body, "Завантаження…");

  try {
    const items = await loader();
    if (myRequest !== currentRequest) {
      return; // пока ждали, пользователь ушёл на другой список
    }
    currentItems = items;
    if (items.length === 0) {
      setStatus(body, "Персонажів не знайдено");
    } else {
      renderCards(body, items);
    }
  } catch {
    // Ошибку показываем текстом и не пробрасываем дальше:
    // необработанный reject — это запись в консоли, то есть провал требования ТЗ.
    if (myRequest !== currentRequest) {
      return;
    }
    currentItems = [];
    renderError(body, () => showList({ title, loader, tabs }));
  }
}
