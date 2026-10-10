import "./base.css";
import "./views/hero.css";
import { getStudents, getStaff, getHouse, HOUSES } from "./api/characters.js";
import { showList } from "./views/list.js";
import { createHouseTabs } from "./views/houseTabs.js";

const hero = document.getElementById("hero");
const categories = document.getElementById("categories");
const view = document.getElementById("view");
const showCategoriesButton = document.getElementById("showCategories");

// Блок выбора раскрыт или нет — это состояние главной, его надо помнить:
// иначе после возврата со списка кнопку пришлось бы жать заново.
let categoriesRevealed = false;

// Кнопка из макета ничего не грузит — она только раскрывает блок выбора.
showCategoriesButton.addEventListener("click", () => {
  categoriesRevealed = true;
  categories.hidden = false;
  categories.scrollIntoView({ behavior: "smooth", block: "start" });
});

function route() {
  const path = location.hash.slice(1); // "#/students" → "/students"
  const parts = path.split("/").filter(Boolean); // "/house/gryffindor" → ["house", "gryffindor"]
  const isHome = parts.length === 0;

  hero.hidden = !isHome;
  categories.hidden = !isHome || !categoriesRevealed;
  view.hidden = isHome;

  if (isHome) {
    return;
  }

  if (parts[0] === "students") {
    showList({ title: "Студенти Гоґвортсу", loader: getStudents });
    return;
  }

  if (parts[0] === "staff") {
    showList({ title: "Співробітники Гоґвортсу", loader: getStaff });
    return;
  }

  if (parts[0] === "house" && HOUSES.includes(parts[1])) {
    showList({
      title: "Персонажі в певному будинку",
      loader: () => getHouse(parts[1]),
      tabs: createHouseTabs(parts[1]),
    });
    return;
  }

  // Неизвестный адрес — возвращаем на главную, отдельный экран 404 тут не нужен.
  location.hash = "";
}

window.addEventListener("hashchange", route);
route();
