import "./base.css";
import "./views/hero.css";

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

  // Временная заглушка: на следующем шаге сюда придёт список персонажей.
  view.textContent = parts.join(" / ");
}

window.addEventListener("hashchange", route);
route();
