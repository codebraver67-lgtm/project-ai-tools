// ── Load todos from localStorage or default list ──
let todos = JSON.parse(localStorage.getItem('todos')) || [
    { id: 1, text: "Complete math homework", completed: false },
    { id: 2, text: "Study for chemistry test", completed: true },
    { id: 3, text: "Read history chapter 5", completed: false }
];

// ── Save todos to localStorage ──
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// ── Render todos ──
function render() {
    const list = document.getElementById('todo-list');
    const stats = document.getElementById('todo-stats');

    if (todos.length === 0) {
        list.innerHTML = '<p class="text-center py-8 text-gray-400">No tasks yet. Add one above!</p>';
        stats.classList.add('hidden');
        return;
    }

    stats.classList.remove('hidden');
    list.innerHTML = todos.map(todo => `
        <div class="flex items-center gap-4 p-4 rounded-lg bg-white/50 border border-gray-100 group transition-all">
            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTodo(${todo.id})"
                   class="w-5 h-5 accent-primary cursor-pointer">
            <span class="flex-1 text-lg ${todo.completed ? 'line-through' : ''}">${todo.text}</span>
            <button onclick="deleteTodo(${todo.id})" 
                    class="text-red-400 hover:text-red-600 font-bold px-2">
                ✕
            </button>
        </div>
    `).join('');

    document.getElementById('remaining-count').innerText = `${todos.filter(t => !t.completed).length} tasks remaining`;
    document.getElementById('completed-count').innerText = `${todos.filter(t => t.completed).length} completed`;
}

// ── Add new todo ──
function addTodo() {
    const input = document.getElementById('todo-input');
    const text = input.value.trim();
    if (text) {
        todos.push({ id: Date.now(), text, completed: false });
        input.value = '';
        saveTodos();
        render();
    }
}

// ── Toggle todo completed state ──
function toggleTodo(id) {
    todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTodos();
    render();
}

// ── Delete a todo ──
function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    render();
}

// ── Event listeners ──
document.getElementById('add-btn').addEventListener('click', addTodo);
document.getElementById('todo-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

// ── Initial render ──
render();
