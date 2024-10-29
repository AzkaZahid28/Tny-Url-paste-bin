const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./controller/main')
const cors = require('cors')
const path = require('path')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'view')))

mongoose.connect('mongodb+srv://maher:zubair@cluster0.s6bce.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/', router)

app.get('/short', (req,res) => {
    res.sendFile(path.join(__dirname, 'view', 'short.html'))
})
app.get('/paste', (req,res) => {
    res.sendFile(path.join(__dirname, 'view', 'paste.html'))
})

app.use('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'))
})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
