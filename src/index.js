const express = require('express');
const app = express();

app.use(express.json());

// In-memory todo listesi
let todos = [];
let nextId = 1;

// Sağlık kontrolü
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Todo API çalışıyor!',
    version: '1.0.0'
  });
});

// Tüm todo'ları getir
app.get('/todos', (req, res) => {
  res.json({ success: true, count: todos.length, data: todos });
});

// Tek todo getir
app.get('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ success: false, message: 'Todo bulunamadı' });
  res.json({ success: true, data: todo });
});

// Yeni todo ekle
app.post('/todos', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ success: false, message: 'Başlık zorunlu' });

  const todo = { id: nextId++, title, completed: false, createdAt: new Date() };
  todos.push(todo);
  res.status(201).json({ success: true, data: todo });
});

// Todo tamamlandı işaretle
app.put('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ success: false, message: 'Todo bulunamadı' });

  const { title, completed } = req.body;
  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = completed;

  res.json({ success: true, data: todo });
});

// Todo sil
app.delete('/todos/:id', (req, res) => {
  const index = todos.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: 'Todo bulunamadı' });

  todos.splice(index, 1);
  res.json({ success: true, message: 'Todo silindi' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Todo API http://localhost:${PORT} adresinde çalışıyor`);
});