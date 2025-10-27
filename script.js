// script.js
document.addEventListener('DOMContentLoaded', function() {
    const addTaskForm = document.getElementById('addTaskForm');
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    
    // Загрузка задач из localStorage при загрузке страницы
    loadTasks();
    
    // Обработчик отправки формы
    addTaskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const taskTitle = document.getElementById('taskTitle').value.trim();
        const taskDescription = document.getElementById('taskDescription').value.trim();
        
        // Проверяем, что название задачи не пустое
        if (!taskTitle) {
            alert('Пожалуйста, введите название задачи');
            return;
        }
        
        // Создаем новую задачу
        addTask(taskTitle, taskDescription);
        
        // Очищаем форму
        addTaskForm.reset();
    });
    
    // Функция добавления задачи
    function addTask(title, description) {
        // Скрываем состояние "нет задач"
        if (emptyState.style.display !== 'none') {
            emptyState.style.display = 'none';
        }
        
        // Создаем элемент задачи
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        
        // Генерируем уникальный ID для задачи
        const taskId = 'task_' + Date.now();
        taskCard.setAttribute('data-id', taskId);
        
        // Создаем дату создания задачи
        const creationDate = new Date().toLocaleString();
        
        // Заполняем содержимое карточки
        taskCard.innerHTML = `
            <div class="task-title">${escapeHtml(title)}</div>
            ${description ? `<div class="task-description">${escapeHtml(description)}</div>` : ''}
            <div class="task-stats">
                <span>Создано: ${creationDate}</span>
                <button class="delete-btn" onclick="deleteTask('${taskId}')">🗑️ Удалить</button>
            </div>
        `;
        
        // Добавляем задачу в список
        taskList.appendChild(taskCard);
        
        // Сохраняем задачи в localStorage
        saveTasks();
    }
    
    // Функция удаления задачи
    window.deleteTask = function(taskId) {
        const taskElement = document.querySelector(`[data-id="${taskId}"]`);
        if (taskElement) {
            taskElement.remove();
            
            // Показываем состояние "нет задач", если список пуст
            if (taskList.children.length === 1) { // Учитываем элемент emptyState
                emptyState.style.display = 'block';
            }
            
            // Обновляем localStorage
            saveTasks();
        }
    };
    
    // Функция для сохранения задач в localStorage
    function saveTasks() {
        const tasks = [];
        const taskElements = document.querySelectorAll('.task-card');
        
        taskElements.forEach(taskElement => {
            const taskId = taskElement.getAttribute('data-id');
            const title = taskElement.querySelector('.task-title').textContent;
            const descriptionElement = taskElement.querySelector('.task-description');
            const description = descriptionElement ? descriptionElement.textContent : '';
            const date = taskElement.querySelector('.task-stats span').textContent.replace('Создано: ', '');
            
            tasks.push({
                id: taskId,
                title: title,
                description: description,
                date: date
            });
        });
        
        localStorage.setItem('dailyPlannerTasks', JSON.stringify(tasks));
    }
    
    // Функция для загрузки задач из localStorage
    function loadTasks() {
        const savedTasks = localStorage.getItem('dailyPlannerTasks');
        
        if (savedTasks) {
            const tasks = JSON.parse(savedTasks);
            
            if (tasks.length > 0) {
                emptyState.style.display = 'none';
                
                tasks.forEach(task => {
                    const taskCard = document.createElement('div');
                    taskCard.className = 'task-card';
                    taskCard.setAttribute('data-id', task.id);
                    
                    taskCard.innerHTML = `
                        <div class="task-title">${escapeHtml(task.title)}</div>
                        ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
                        <div class="task-stats">
                            <span>Создано: ${task.date}</span>
                            <button class="delete-btn" onclick="deleteTask('${task.id}')">🗑️ Удалить</button>
                        </div>
                    `;
                    
                    taskList.appendChild(taskCard);
                });
            }
        }
    }
    
    // Функция для экранирования HTML (защита от XSS)
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
