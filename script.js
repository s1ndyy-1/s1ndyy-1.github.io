// ---------------------------
// Базовые переменные
// ---------------------------
const calendar = document.getElementById('calendar');
const monthName = document.getElementById('monthName');
const peopleSelect = document.getElementById('peopleSelect');
const priceEl = document.getElementById('price');
const bookingBtn = document.getElementById('booking-btn');
const bookingMessage = document.getElementById('booking-message');

// Массив для бронирований
let bookings = [];

// Цены за человека
const prices = [1000,1800,2500,3200,3900,4600,5300];

let selectedDate = null;

// ---------------------------
// Настройка календаря
// ---------------------------
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();

const monthNames = [
    'Январь','Февраль','Март','Апрель','Май','Июнь',
    'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'
];

monthName.textContent = `${monthNames[month]} ${year}`;

// Количество дней в месяце и первый день
const firstDay = new Date(year, month, 1).getDay();
const daysInMonth = new Date(year, month + 1, 0).getDate();

// Пустые ячейки перед первым днем месяца
for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(document.createElement('div')).className = 'date empty';
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
    } else {
        cell.onclick = () => {
            document.querySelector('.date.selected')?.classList.remove('selected');
            cell.classList.add('selected');
            selectedDate = dateStr;
            updatePrice();
        };
    }

    calendar.appendChild(cell);
}

// ---------------------------
// Функция обновления цены
// ---------------------------
function updatePrice() {
    const p = parseInt(peopleSelect.value);
    priceEl.textContent = `Цена: ${prices[p-1]} ₽`;
}

peopleSelect.onchange = updatePrice;

// ---------------------------
// Кнопка бронирования
// ---------------------------
bookingBtn.addEventListener('click', () => {
    const name = document.getElementById('booking-name').value.trim();
    const phone = document.getElementById('booking-phone').value.trim();
    const people = parseInt(peopleSelect.value);

    if (!selectedDate) {
        alert('Пожалуйста, выберите дату в календаре!');
        return;
    }
    if (!name || !phone) {
        alert('Пожалуйста, введите имя и телефон!');
        return;
    }

    const price = prices[people - 1];

    // Добавляем бронь в массив
    bookings.push({ date: selectedDate, name, phone, people, price });

    // Выводим сообщение о брони
    bookingMessage.textContent = `Спасибо, ${name}! С вами скоро свяжутся для подтверждения брони.`;
    bookingMessage.style.display = 'block';

    // Автоочистка формы
    document.getElementById('booking-name').value = '';
    document.getElementById('booking-phone').value = '';
    peopleSelect.value = '1';
    document.querySelector('.date.selected')?.classList.remove('selected');

    // Отображение даты как забронированной сразу
    const cells = document.querySelectorAll('#calendar .date');
    cells.forEach(cell => {
        const cellDate = `${year}-${String(month+1).padStart(2,'0')}-${String(cell.textContent).padStart(2,'0')}`;
        if (cellDate === selectedDate) {
            cell.classList.add('booked');
            cell.onclick = null; // нельзя выбрать уже забронированную дату
        }
    });

    selectedDate = null; // сброс выбранной даты
});
