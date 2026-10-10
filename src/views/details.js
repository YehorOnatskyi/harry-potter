import "./details.css";
import { characterRows } from "../lib/format.js";

const details = document.getElementById("details");

const GAP = 12;

// Панель одна на всю страницу. Делать её внутри каждой карточки нельзя:
// у 103 карточек это ~1750 узлов, которых никто не видит, и панель обрезало бы
// переполнением сетки у правой колонки и нижнего ряда.
let pinnedCard = null;

function fill(character) {
  const list = document.createElement("dl");
  list.className = "details__list";

  for (const row of characterRows(character)) {
    const label = document.createElement("dt");
    label.className = "details__label";
    label.textContent = `${row.label}:`;

    const value = document.createElement("dd");
    value.className = "details__value";
    // textContent, а не innerHTML: строки приходят из чужого API,
    // и экранировать их вручную не нужно, если не вставлять как разметку.
    value.textContent = row.value;

    list.append(label, value);
  }

  details.replaceChildren(list);
}

function position(card) {
  const cardRect = card.getBoundingClientRect();
  const panel = details.getBoundingClientRect();

  // Сначала пробуем справа от карточки, не влезло — слева.
  let left = cardRect.right + GAP;
  if (left + panel.width + GAP > window.innerWidth) {
    left = cardRect.left - panel.width - GAP;
  }
  left = Math.max(GAP, left);

  // Верх выравниваем по карточке, но не даём уехать за экран.
  let top = Math.min(cardRect.top, window.innerHeight - panel.height - GAP);
  top = Math.max(GAP, top);

  details.style.left = `${left}px`;
  details.style.top = `${top}px`;
}

export function showDetails(character, card) {
  fill(character);
  details.hidden = false; // показать до замеров, иначе высота панели будет нулевой
  position(card);
}

export function hideDetails() {
  if (pinnedCard) {
    return; // закреплённую панель закрывает только повторный клик или Escape
  }
  details.hidden = true;
}

function unpin() {
  if (!pinnedCard) {
    return;
  }
  pinnedCard
    .querySelector(".card__more")
    ?.setAttribute("aria-expanded", "false");
  pinnedCard = null;
  details.hidden = true;
  details.classList.remove("details--pinned");
}

function findCharacter(items, card) {
  return items.find((item) => item.id === card.dataset.id);
}

// Вешаем обработчики на сетку, а не на каждую карточку: один слушатель вместо сотни.
export function bindDetails(grid, items) {
  unpin();

  grid.addEventListener("mouseover", (event) => {
    const card = event.target.closest(".card");
    if (!card || pinnedCard) {
      return;
    }
    const character = findCharacter(items, card);
    if (character) {
      showDetails(character, card);
    }
  });

  grid.addEventListener("mouseout", (event) => {
    const card = event.target.closest(".card");
    if (card && !card.contains(event.relatedTarget)) {
      hideDetails();
    }
  });

  // Клавиатура: карточка получает фокус на кнопке «Більше інформації».
  grid.addEventListener("focusin", (event) => {
    const card = event.target.closest(".card");
    if (!card || pinnedCard) {
      return;
    }
    const character = findCharacter(items, card);
    if (character) {
      showDetails(character, card);
    }
  });

  grid.addEventListener("focusout", (event) => {
    const card = event.target.closest(".card");
    if (card && !card.contains(event.relatedTarget)) {
      hideDetails();
    }
  });

  // Клик закрепляет панель. Это единственный рабочий путь на тач-экранах,
  // где наведения нет вообще.
  grid.addEventListener("click", (event) => {
    const button = event.target.closest(".card__more");
    if (!button) {
      return;
    }
    const card = button.closest(".card");

    if (pinnedCard === card) {
      unpin();
      return;
    }

    unpin();
    const character = findCharacter(items, card);
    if (!character) {
      return;
    }
    showDetails(character, card);
    pinnedCard = card;
    details.classList.add("details--pinned");
    button.setAttribute("aria-expanded", "true");
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    unpin();
    details.hidden = true;
  }
});

window.addEventListener(
  "scroll",
  () => {
    if (pinnedCard) {
      position(pinnedCard); // закреплённая панель едет вместе с карточкой
    } else {
      details.hidden = true;
    }
  },
  { passive: true },
);
