// admin.js — финальная версия

const calendar = document.getElementById('calendar');
const monthName = document.getElementById('monthName');
const adminPanel = document.getElementById('admin-panel');
const adminDate = document.getElementById('admin-date');
const adminInfo = document.getElementById('admin-info');
const toggleBtn = document.getElementById('admin-toggle-booking');

// Массив бронирований
let bookings = [
    {
        date: new Date().toISOString().split('T')[0], // сегодняшняя дата
        name: 'Денис',
        phone: '89180580405',
        price: 2,
        comment: 'Тестовая бронь'
    }
];

// Настройка календаря
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();

const monthNames = [
    'Январь','Февраль','Март','Апрель','Май','Июнь',
    'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'
];

monthName.textContent = `${monthNames[month]} ${year}`;

// Дни месяца
const firstDay = new Date(year, month, 1).getDay();
const daysInMonth = new Date(year, month + 1, 0).getDate();

// Пустые ячейки перед первым днем месяца
for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'date empty';
    calendar.appendChild(empty);
}

// Создание ячеек дней
for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement('div');
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

    cell.className = 'date';
    cell.textContent = day;

    // Проверка, забронирована ли дата
    if (bookings.some(b => b.date === dateStr)) {
        cell.classList.add('booked');
    }

    calendar.appendChild(cell);

    // Клик / tap для админ-панели
    cell.addEventListener('click', () => openAdminPanel(dateStr, cell));
}

// Функция открытия панели админа
function openAdminPanel(dateStr, cell) {
    const booking = bookings.find(b => b.date === dateStr);
    adminPanel.classList.remove('hidden');
    adminDate.textContent = `Дата: ${dateStr}`;

    if (booking) {
        adminInfo.innerHTML = `
            <p>Статус: Занято</p>
            <p>Имя: ${booking.name}</p>
            <p>Телефон: ${booking.phone}</p>
            <p>Цена: ${booking.price}</p>
            <p>Комментарий: ${booking.comment}</p>
        `;
        toggleBtn.textContent = 'Снять бронь';
    } else {
        adminInfo.innerHTML = `
            <p>Статус: Свободно</p>
            <p>Имя: <input id="nameInput"></p>
            <p>Телефон: <input id="phoneInput"></p>
            <p>Цена: <input id="priceInput" type="number" min="1" max="7"></p>
            <p>Комментарий: <input id="commentInput"></p>
        `;
        toggleBtn.textContent = 'Поставить бронь';
    }

    toggleBtn.onclick = () => {
        if (booking) {
            // Снимаем бронь
            bookings = bookings.filter(b => b.date !== dateStr);
            cell.classList.remove('booked');
        } else {
            // Ставим бронь
            const name = document.getElementById('nameInput').value;
            const phone = document.getElementById('phoneInput').value;
            const price = parseInt(document.getElementById('priceInput').value);
            const comment = document.getElementById('commentInput').value;

            if (!name || !phone || !price) {
                alert('Введите имя, телефон и цену!');
                return;
            }

            bookings.push({date: dateStr, name, phone, price, comment});
            cell.classList.add('booked');
        }
        adminPanel.classList.add('hidden');
    };
}
