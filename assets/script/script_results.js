// Объявление всех DOM-элементов
const currentResultContainer = document.getElementById('currentResult');
const resultsContainer = document.getElementById('resultsContainer');

/// Загружаем результаты из localStorage
function loadResults() {
    const allResults = JSON.parse(localStorage.getItem('danHengQuizResults')) || [];
    
    // Очищаем контейнеры
    currentResultContainer.innerHTML = '';
    resultsContainer.innerHTML = '';
    
    // Показываем текущий результат (последний)
    if (allResults.length > 0) {
        const currentResult = allResults[allResults.length - 1];
        const percentage = (currentResult.score / currentResult.total) * 100;
        
        let message = '';
        if (percentage >= 90) {
            message = 'Вы настоящий эксперт по Дань Хэну!';
        } else if (percentage >= 70) {
            message = 'Отличные знания о Дань Хэне!';
        } else if (percentage >= 50) {
            message = 'Хорошие знания, но есть куда расти';
        } else {
            message = 'Попробуйте пройти тест еще раз';
        }
        
        // Создаем элементы для текущего результата
        const resultSummary = document.createElement('div');
        resultSummary.className = 'result-summary';
        
        const resultTitle = document.createElement('div');
        resultTitle.className = 'result-title';
        resultTitle.textContent = 'Ваш результат';
        
        const resultScore = document.createElement('div');
        resultScore.className = 'result-score';
        resultScore.textContent = `${currentResult.score}/${currentResult.total}`;
        
        const resultMessage = document.createElement('div');
        resultMessage.className = 'result-message';
        resultMessage.textContent = message;
        
        resultSummary.appendChild(resultTitle);
        resultSummary.appendChild(resultScore);
        resultSummary.appendChild(resultMessage);
        currentResultContainer.appendChild(resultSummary);
    }
    
    if (allResults.length === 0) {
        const emptyResults = document.createElement('div');
        emptyResults.className = 'empty-results';
        
        const paragraph = document.createElement('p');
        paragraph.textContent = 'Пока нет результатов тестирования.';
        
        const link = document.createElement('a');
        link.href = 'test-dan-heng.html';
        link.className = 'btn';
        link.style.marginTop = '15px';
        link.textContent = 'Пройти тест';
        
        emptyResults.appendChild(paragraph);
        emptyResults.appendChild(link);
        resultsContainer.appendChild(emptyResults);
        return;
    }
    
    // Создаем таблицу через DOM методы
    const table = document.createElement('table');
    table.className = 'results-table';
    
    // Создаем заголовок таблицы
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const headers = ['Имя', 'Дата рождения', 'Пол', 'Результат', 'Действия'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Создаем тело таблицы
    const tbody = document.createElement('tbody');
    
    allResults.forEach((result, index) => {
        const row = document.createElement('tr');
        
        // Ячейка имени
        const nameCell = document.createElement('td');
        nameCell.textContent = result.userData.name;
        row.appendChild(nameCell);
        
        // Ячейка даты рождения
        const birthDateCell = document.createElement('td');
        birthDateCell.textContent = result.userData.birthDate;
        row.appendChild(birthDateCell);
        
        // Ячейка пола
        const genderCell = document.createElement('td');
        genderCell.textContent = result.userData.gender === 'male' ? 'Мужской' : 'Женский';
        row.appendChild(genderCell);
        
        // Ячейка результата
        const scoreCell = document.createElement('td');
        scoreCell.textContent = `${result.score} / ${result.total}`;
        const percentage = (result.score / result.total) * 100;
        
        // Определяем класс для цвета результата
        if (percentage >= 80) {
            scoreCell.className = 'score-cell high-score';
        } else if (percentage >= 50) {
            scoreCell.className = 'score-cell medium-score';
        } else {
            scoreCell.className = 'score-cell low-score';
        }
        row.appendChild(scoreCell);
        
        // Ячейка действий
        const actionsCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger delete-btn';
        deleteButton.textContent = 'Удалить';
        deleteButton.dataset.index = index;
        
        deleteButton.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            deleteResult(index);
        });
        
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    resultsContainer.appendChild(table);
}

// Удаление конкретного результата
function deleteResult(index) {
    const allResults = JSON.parse(localStorage.getItem('danHengQuizResults')) || [];
    allResults.splice(index, 1);
    localStorage.setItem('danHengQuizResults', JSON.stringify(allResults));
    loadResults();
}


document.addEventListener('DOMContentLoaded', loadResults);