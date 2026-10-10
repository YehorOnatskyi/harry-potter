const BASE = "https://hp-api.onrender.com/api";

// Ответы кешируем на время сессии: переключение между списками и вкладками
// факультетов не должно каждый раз ходить на сервер. Бесплатный Render засыпает,
// и повторный запрос может стоить десятки секунд.
const cache = new Map();

async function getList(path) {
  if (cache.has(path)) {
    return cache.get(path);
  }

  const response = await fetch(`${BASE}${path}`);

  if (!response.ok) {
    throw new Error(`Помилка ${response.status}`);
  }

  const data = await response.json();
  cache.set(path, data); // кладём только успех — после ошибки запрос можно повторить
  return data;
}

export const HOUSES = ["gryffindor", "slytherin", "ravenclaw", "hufflepuff"];

export const getStudents = () => getList("/characters/students");

export const getStaff = () => getList("/characters/staff");

export const getHouse = (house) => getList(`/characters/house/${house}`);
