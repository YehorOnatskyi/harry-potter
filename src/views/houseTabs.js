import "./houseTabs.css";
import { HOUSES } from "../api/characters.js";

// Названия в макете английские и капсом — оставляем как нарисовано.
const LABELS = {
  gryffindor: "Gryffindor",
  slytherin: "Slytherin",
  ravenclaw: "Ravenclaw",
  hufflepuff: "Hufflepuff",
};

// Гербы — настоящие картинки из макета, вытащены из CDN Figma.
function createCrest(house) {
  const crest = document.createElement("img");
  crest.className = "houseTabs__crest";
  crest.src = `/img/crest-${house}.png`;
  crest.alt = ""; // декоративная: название факультета рядом текстом
  crest.width = 96;
  crest.height = 106;
  return crest;
}

export function createHouseTabs(activeHouse) {
  const nav = document.createElement("nav");
  nav.className = "houseTabs";
  nav.setAttribute("aria-label", "Будинки Гоґвортсу");

  for (const house of HOUSES) {
    const tab = document.createElement("a");
    tab.className = "houseTabs__tab";
    tab.href = `#/house/${house}`;
    tab.append(createCrest(house), LABELS[house]);

    if (house === activeHouse) {
      tab.classList.add("houseTabs__tab--active");
      tab.setAttribute("aria-current", "page");
    }

    nav.append(tab);
  }

  return nav;
}
