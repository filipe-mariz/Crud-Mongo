const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(cors());
app.use(express.json());

// Conectando ao MongoDB
mongoose.connect('mongodb://localhost:27017/crud_example', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro na conexão com o MongoDB:'));
db.once('open', () => {
    console.log('Conectado ao MongoDB');
});

// Definindo um modelo
const model = {
    name: String,
    description: String
}

const Item = mongoose.model('Item', model);

// Configurando o body-parser para lidar com JSON
app.use(bodyParser.json());

app.post('/items', async (req, res) => {
    console.log(req.body);

    try {
        const newItem = new Item(req.body);

        console.log(newItem);

        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/items/:id?', async (req, res) => {
    console.log(req.params.id);
    try {
        const action = req.params.id ? 'findById' : 'find';

        const items = await Item[action](req.params.id);
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/items/:id', async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/items/:id', async (req, res) => {
    try {
        const resp = await Item.findByIdAndDelete(req.params.id);
        res.sendStatus(204, resp);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(3000, console.log('server is run'));
