toast = document.querySelector(".toast");
progress = document.querySelector(".progress");

let timer1, timer2;
const API_URL = "https://flax-swift-patio.glitch.me/orders"; // URL API

// Функция добавления данных в таблицу
function addOrderToTable(order) {
  const tableBody = document.querySelector("#ordersTable tbody");

  // Проверяем, чтобы в таблице было не больше 50 строк
  while (tableBody.rows.length >= 50) {
    tableBody.deleteRow(tableBody.rows.length - 1);
  }

  // Создаём новую строку
  const row = tableBody.insertRow(0); // Вставляем в начало таблицы

  // Заполняем ячейки
  row.insertCell(0).textContent = order.id || "-";
  row.insertCell(1).textContent = order.buyer || "-";
  row.insertCell(2).textContent = order.product || "-";
  row.insertCell(3).textContent = order.telegram || "-";
}

// Функция рендеринга таблицы
function renderTable(filteredOrders) {
  const tableBody = document.querySelector("#ordersTable tbody");
  tableBody.innerHTML = ""; // Очищаем таблицу перед рендерингом
  filteredOrders.forEach((order) => addOrderToTable(order));
}

// Функция загрузки данных из API
async function fetchOrders() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Ошибка при загрузке данных");
    const data = await response.json();

    // Очищаем таблицу перед обновлением
    const tableBody = document.querySelector("#ordersTable tbody");
    tableBody.innerHTML = "";

    // Сохраняем данные для фильтрации
    window.orders = data;

    // Добавляем каждый заказ в таблицу
    renderTable(data);
  } catch (error) {
    toast.classList.add("active");
    progress.classList.add("active");

    timer1 = setTimeout(() => {
      toast.classList.remove("active");
    }, 5000); //1s = 1000 milliseconds

    timer2 = setTimeout(() => {
      progress.classList.remove("active");
    }, 5300);
  }
}

// Функция удаления элемента по ID
async function deleteOrderById(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      document.getElementById(
        "deleteMessage"
      ).textContent = `Заказ с ID ${id} успешно удалён!`;
      fetchOrders(); // Обновляем таблицу после удаления
    } else {
      throw new Error(`Не удалось удалить заказ с ID ${id}`);
    }
  } catch (error) {
    toast.classList.add("active");
    progress.classList.add("active");

    timer1 = setTimeout(() => {
      toast.classList.remove("active");
    }, 5000); //1s = 1000 milliseconds

    timer2 = setTimeout(() => {
      progress.classList.remove("active");
    }, 5300);
  }
}

// Обработчик для кнопки удаления
document.getElementById("deleteButton").addEventListener("click", () => {
  const deleteId = document.getElementById("deleteId").value.trim();
  if (deleteId) {
    deleteOrderById(deleteId);
  } else {
    document.getElementById("deleteMessage").textContent =
      "Пожалуйста, введите ID!";
  }
});

// Обработчик для поля поиска
document.getElementById("searchInput").addEventListener("input", (e) => {
  const searchValue = e.target.value.toLowerCase();
  const filteredOrders = window.orders.filter((order) =>
    Object.values(order).some((field) =>
      field.toLowerCase().includes(searchValue)
    )
  );
  renderTable(filteredOrders);
});

// Обновляем таблицу каждые 10 секунд
setInterval(fetchOrders, 10000);
fetchOrders();
