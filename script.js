document.addEventListener('DOMContentLoaded', function() {
    
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    
    let currentFilter = 'all';
    
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    
    renderTasks();

    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const taskText = taskInput.value.trim();
        if (!taskText) return;
        
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        
    
        taskInput.value = '';
        taskInput.focus();
    });
    
    
    taskList.addEventListener('click', function(e) {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;
        
        const taskId = Number(taskItem.dataset.id);
        
        
        if (e.target.closest('.complete-btn')) {
            toggleTaskStatus(taskId);
        }
        
    
        if (e.target.closest('.delete-btn')) {
            deleteTask(taskId, taskItem);
        }
    });
    

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentFilter = this.dataset.filter;
            
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            renderTasks();
        });
    });
    
    
    function toggleTaskStatus(id) {
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            saveTasks();
            
            const taskItem = document.querySelector(`[data-id="${id}"]`);
            if (tasks[taskIndex].completed) {
                taskItem.classList.add('completed');
            } else {
                taskItem.classList.remove('completed');
            }
            
            
            if ((currentFilter === 'active' && tasks[taskIndex].completed) || 
                (currentFilter === 'completed' && !tasks[taskIndex].completed)) {
                setTimeout(() => {
                    renderTasks();
                }, 300);
            }
        }
    }
    
    
    function deleteTask(id, taskElement) {
        
        taskElement.classList.add('deleting');
        
        
        setTimeout(() => {
            
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            renderTasks();
        }, 300);
    }
    
    
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    
    function renderTasks() {
        taskList.innerHTML = '';
        
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true; 
        });
        
        if (filteredTasks.length === 0) {
            taskList.style.display = 'none';
            emptyState.style.display = 'block';
        } else {
            taskList.style.display = 'block';
            emptyState.style.display = 'none';
            
            filteredTasks.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
                taskItem.dataset.id = task.id;
                
                taskItem.innerHTML = `
                    <span class="task-text">${escapeHTML(task.text)}</span>
                    <div class="task-actions">
                        <button class="task-btn complete-btn" title="${task.completed ? 'Mark as incomplete' : 'Mark as complete'}">
                            ${task.completed ? '✓' : '○'}
                        </button>
                        <button class="task-btn delete-btn" title="Delete task">×</button>
                    </div>
                `;
                
                taskList.appendChild(taskItem);
            });
        }
    }
    
    
    function escapeHTML(str) {
        return str.replace(/[&<>"']/g, function(match) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[match];
        });
    }
});