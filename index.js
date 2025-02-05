require('dotenv').config();

const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const username = encodeURIComponent(process.env.DB_USER);
const password = encodeURIComponent(process.env.DB_PASSWORD);
const MONGODB_URI = `mongodb+srv://${username}:${password}@pj9-frameworks-js.r6kzs.mongodb.net/?retryWrites=true&w=majority&appName=PJ9-Frameworks-JS`


app.use(express.json());
app.use(express.static('public'));
app.use(cors());
app.use(morgan('dev'));


const connectDB = async () => {
    const uri = MONGODB_URI;

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {

        await client.connect();


        await client.db("admin").command({ ping: 1 });
        console.log("Conexió exitosa a MongoDB!");


        app.locals.dbClient = client;
    } catch (error) {
        console.error("Error al conectar amb MongoDB:", error);
        process.exit(1);
    }
};

app.post('/user/login', async (req, res) => {
    const { name, password } = req.body;
    console.log('Intent de login per a:', name);

    if (!name || !password) {
        return res.status(400).json({ error: "S'han d'introduir nombre, contraseña y rol" });
    }

    try {
        const client = app.locals.dbClient;
        const db = client.db('PJ9-Database');
        const usersCollection = db.collection('Users-Collection');
        const collections = await db.listCollections().toArray();
        console.log('Coleccions disponibles:', collections.map(c => c.name));

        const user = await usersCollection.findOne({ name });
        console.log('Resultat de la consulta:', user);

        if (!user) {
            console.log(name);
            return res.status(404).json({ error: 'Usuari no trobat' });
        }

        const match = (password === user.password) ? true : false;

        if (!match) {
            return res.status(401).json({ error: 'Contrasenya incorrecta' });
        }

        const { password: userPassword, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);

    } catch (error) {
        console.error('Error al buscar el usuari:', error);
        res.status(500).json({ error: 'Error intern del server' });
    }
});

app.post('/user/create', async (req, res) => {
    const { name, password, role } = req.body;

    if (!name || !password || !role) {
        return res.status(400).json({ error: "S'han d'introduir nombre, contraseña y rol" });
    }

    try {
        const client = app.locals.dbClient;
        const db = client.db('PJ9-Database');
        const usersCollection = db.collection('Users-Collection');

        const existingUser = await usersCollection.findOne({ name });
        if (existingUser) {
            return res.status(409).json({ error: 'El usuari ja existeix' });
        }

        const newUser = { name, role, password };
        const result = await usersCollection.insertOne(newUser);
        console.log('Usuari creat:', result.insertedId);

        const users = await usersCollection.find().toArray();
        console.log('Usuaris a la colección:', users);

        res.status(201).json({ message: 'Usuari creat correctament', userId: result.insertedId });

    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error intern del server' });
    }
});


app.delete('/user/delete', async (req, res) => {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: "S'ha d'introduir un nom d'usuari" });
    }

    try {
        const client = app.locals.dbClient;
        const db = client.db('PJ9-Database');
        const usersCollection = db.collection('Users-Collection');

        const result = await usersCollection.deleteOne({ name });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Usuari no trobat' });
        }

        res.json({ message: 'Usuari eliminat correctament' });

    } catch (error) {
        console.error('Error al eliminar usuari:', error);
        res.status(500).json({ error: 'Error intern del server' });
    }
});



app.get('/', (req, res) => {
    res.send('Servidor Express y MongoDB Atlas funcionando correctamente!');
});

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Servidor corriendo en http://localhost:${PORT}/login.html`);
    });
});
