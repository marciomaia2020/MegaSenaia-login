const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());

app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    // Verificar se o usuário já existe
    User.findOne({ username })
        .then(user => {
            if (user) {
                res.json({ success: false, message: 'Nome de usuário já está em uso.' });
            } else {
                const newUser = new User({ username, password });
                newUser.save()
                    .then(() => res.json({ success: true }))
                    .catch(err => res.json({ success: false, message: err.message }));
            }
        })
        .catch(err => res.json({ success: false, message: err.message }));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Verificar as credenciais de login
    User.findOne({ username, password })
        .then(user => {
            if (user) {
                res.json({ success: true });
            } else {
                res.json({ success: false, message: 'Credenciais inválidas.' });
            }
        })
        .catch(err => res.json({ success: false, message: err.message }));
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
