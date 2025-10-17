// Объявление всех DOM-элементов
const authForm = document.getElementById('authForm');
const birthDateInput = document.getElementById('birthDate');
const video = document.getElementById('bgVideo');
const nameInput = document.getElementById('name');
const nameError = document.getElementById('nameError');
const birthDateError = document.getElementById('birthDateError');
const genderInput = document.getElementById('gender');
const genderError = document.getElementById('genderError');

// Функция для получения даты вчерашнего дня в формате YYYY-MM-DD
function getYesterdayDate() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
}

// Функция для проверки, является ли дата вчерашней или ранее
function isValidBirthDate(dateString) {
    const inputDate = new Date(dateString);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 59, 59, 999);
    
    return inputDate <= yesterday;
}

// Устанавливаем максимальную дату при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const yesterday = getYesterdayDate();
    birthDateInput.setAttribute('max', yesterday);
    
    // Если видео не загрузилось, скрываем видео-контейнер
    video.addEventListener('error', function() {
        document.querySelector('.video-background').style.display = 'none';
    });
    
    // Пытаемся воспроизвести видео программно
    const playVideo = () => {
        video.play().catch(error => {
            console.log('Автовоспроизведение заблокировано:', error);
            // Можно показать кнопку для ручного запуска видео
        });
    };
    
    // Попытка воспроизвести видео после загрузки метаданных
    video.addEventListener('loadedmetadata', playVideo);
    
    // Если метаданные уже загружены
    if (video.readyState >= 1) {
        playVideo();
    }
});

// Валидация формы
authForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Валидация имени
    const name = nameInput.value;
    const nameRegex = /^[А-ЯЁ][а-яё]*$/;
    
    if (!nameRegex.test(name)) {
        nameError.style.display = 'block';
        return;
    } else {
        nameError.style.display = 'none';
    }
    
    // Валидация даты рождения
    const birthDateValue = birthDateInput.value;
    const birthDate = new Date(birthDateValue);
    const birthYear = birthDate.getFullYear();
    
    if (!birthDateValue || isNaN(birthDate.getTime()) || birthYear < 1900 || !isValidBirthDate(birthDateValue)) {
        birthDateError.style.display = 'block';
        return;
    } else {
        birthDateError.style.display = 'none';
    }
    
    // Валидация пола
    const gender = genderInput.value;
    
    if (!gender) {
        genderError.style.display = 'block';
        return;
    } else {
        genderError.style.display = 'none';
    }
    
    // Сохраняем данные пользователя в sessionStorage
    const userData = {
        name: name,
        birthDate: birthDateValue,
        gender: gender
    };
    
    sessionStorage.setItem('userData', JSON.stringify(userData));
    
    
    window.location.href = 'assets/html/test-dan-heng.html';
});