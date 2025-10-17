// Объявление всех DOM-элементов
const userNameElement = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');
const questionCounter = document.getElementById('questionCounter');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const testForm = document.getElementById('testForm');
const q10Input = document.getElementById('q10-input');

// Получаем все элементы вопросов
const questionElements = [];
for (let i = 1; i <= 10; i++) {
    questionElements.push(document.getElementById(`question${i}`));
}

// Получаем все сообщения о необходимости ответа
const answerRequiredMessages = [];
for (let i = 1; i <= 10; i++) {
    const message = document.getElementById(`answerRequired${i}`);
    if (message) answerRequiredMessages.push(message);
}

// Переменные состояния
const totalQuestions = 10;
let currentQuestion = 1;

// Проверяем, авторизован ли пользователь
const userData = JSON.parse(sessionStorage.getItem('userData'));
if (!userData) {
    window.location.href = '../../index.html';
} else {
    userNameElement.textContent = userData.name;
}

// Обработка выхода
logoutBtn.addEventListener('click', function() {
    sessionStorage.removeItem('userData');
    window.location.href = '../../index.html';
});

// Обновление счетчика вопросов
function updateQuestionCounter() {
    questionCounter.textContent = `Вопрос ${currentQuestion} из ${totalQuestions}`;
}

// Проверка, отвечен ли вопрос
function isQuestionAnswered(questionNum) {
    if (questionNum === 10) {
        // Для вопроса с свободным вводом
        return q10Input.value.trim() !== '';
    } else {
        // Для вопросов с выбором ответа
        const options = document.querySelectorAll(`input[name="q${questionNum}"]`);
        for (let option of options) {
            if (option.checked) return true;
        }
        return false;
    }
}

// Показать/скрыть сообщение о необходимости ответа
function updateAnswerRequiredMessage() {
    const isAnswered = isQuestionAnswered(currentQuestion);
    const messageElement = document.getElementById(`answerRequired${currentQuestion}`);
    
    if (messageElement) {
        messageElement.classList.toggle('hidden', isAnswered);
    }
}

// Переход к вопросу
function goToQuestion(questionNum) {
    // Проверяем, можно ли перейти от текущего вопроса
    if (questionNum > currentQuestion && !isQuestionAnswered(currentQuestion)) {
        updateAnswerRequiredMessage();
        return; // Не позволяем перейти дальше без ответа
    }
    
    // Скрываем текущий вопрос
    document.getElementById(`question${currentQuestion}`).classList.remove('active');
    
    // Показываем новый вопрос
    document.getElementById(`question${questionNum}`).classList.add('active');
    currentQuestion = questionNum;
    
    
    updateQuestionCounter();
    updateButtons();
    updateAnswerRequiredMessage();
    
    // Прокручиваем к верху вопроса
    document.getElementById(`question${questionNum}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Обновление состояния кнопок
function updateButtons() {
    prevBtn.disabled = currentQuestion === 1;
    
    // Кнопка "Следующий вопрос" активна только если текущий вопрос отвечен
    nextBtn.disabled = !isQuestionAnswered(currentQuestion);
    
    if (currentQuestion === totalQuestions) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }
}

// Обработчики навигации
prevBtn.addEventListener('click', function() {
    if (currentQuestion > 1) {
        goToQuestion(currentQuestion - 1);
    }
});

nextBtn.addEventListener('click', function() {
    if (currentQuestion < totalQuestions) {
        // Проверяем, отвечен ли текущий вопрос
        if (isQuestionAnswered(currentQuestion)) {
            goToQuestion(currentQuestion + 1);
        } else {
            updateAnswerRequiredMessage();
        }
    }
});

// Обработчики для выбора ответов
document.querySelectorAll('.option input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function() {
        // Убираем выделение у всех вариантов в этом вопросе
        const questionElement = this.closest('.question');
        questionElement.querySelectorAll('.option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Выделяем выбранный вариант
        this.closest('.option').classList.add('selected');
        
        // Обновляем кнопки и сообщение
        updateButtons();
        updateAnswerRequiredMessage();
    });
});

// Обработчик для свободного ввода
q10Input.addEventListener('input', function() {
    updateButtons();
    updateAnswerRequiredMessage();
});

// Инициализация
updateQuestionCounter();
updateButtons();
updateAnswerRequiredMessage(); // ДОБАВЛЕНА ЭТА СТРОКА - показывает сообщение на первом вопросе при загрузке

// Отправка теста
testForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Проверяем, что на все вопросы даны ответы
    let allAnswered = true;
    for (let i = 1; i <= totalQuestions; i++) {
        if (!isQuestionAnswered(i)) {
            allAnswered = false;
            break;
        }
    }
    
    if (!allAnswered) {
        alert('Пожалуйста, ответьте на все вопросы перед завершением теста.');
        return;
    }
    
    // Собираем ответы
    const formData = new FormData(this);
    const answers = {};
    
    for (let [key, value] of formData.entries()) {
        answers[key] = value;
    }
    
    // Правильные ответы
    const correctAnswers = {
        q1: 'a',
        q2: 'c',
        q3: 'a',
        q4: 'b',
        q5: 'a',
        q6: 'a',
        q7: 'a',
        q8: 'b',
        q9: 'a',
        q10: 'Дань Фэн'
    };
    
    // Подсчет баллов
    let score = 0;
    for (let q in answers) {
        if (q === 'q10') {
            // Для свободного ввода проверяем без учета регистра и пробелов
            if (answers[q].toLowerCase().replace(/\s+/g, '') === correctAnswers[q].toLowerCase().replace(/\s+/g, '')) {
                score++;
            }
        } else if (answers[q] === correctAnswers[q]) {
            score++;
        }
    }
    
    // Сохраняем результат
    const result = {
        userData: userData,
        answers: answers,
        score: score,
        total: totalQuestions,
        date: new Date().toISOString()
    };
    
    // Сохраняем в localStorage
    let allResults = JSON.parse(localStorage.getItem('danHengQuizResults')) || [];
    allResults.push(result);
    localStorage.setItem('danHengQuizResults', JSON.stringify(allResults));
    
    // Переходим на страницу результатов
    window.location.href = 'results-dan-heng.html';
});