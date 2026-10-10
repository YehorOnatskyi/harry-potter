import "./houseTabs.css";
import { HOUSES } from "../api/characters.js";

// Названия в макете английские и капсом — оставляем как нарисовано.
const LABELS = {
  gryffindor: "Gryffindor",
  slytherin: "Slytherin",
  ravenclaw: "Ravenclaw",
  hufflepuff: "Hufflepuff",
};

// Цвета факультетов. Герб пока рисуем щитом: настоящие картинки из макета
// подставим в public/img, когда появится экспорт.
const COLORS = {
  gryffindor: "#7f0909",
  slytherin: "#0d6217",
  ravenclaw: "#000a90",
  hufflepuff: "#eee117",
};

const SVG_NS = "http://www.w3.org/2000/svg";

function createCrest(house) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "houseTabs__crest");
  svg.setAttribute("viewBox", "0 0 24 28");
  svg.setAttribute("aria-hidden", "true");

  const shield = document.createElementNS(SVG_NS, "path");
  shield.setAttribute("d", "M12 1 23 5v10c0 6-5 10-11 12C6 25 1 21 1 15V5Z");
  shield.setAttribute("fill", COLORS[house]);
  shield.setAttribute("stroke", "#d3a625");
  shield.setAttribute("stroke-width", "1.5");

  svg.append(shield);
  return svg;
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
