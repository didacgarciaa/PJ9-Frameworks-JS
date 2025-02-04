require('dotenv').config(); // Cargar variables de entorno

const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const username = encodeURIComponent(process.env.DB_USER);
const password = encodeURIComponent(process.env.DB_PASSWORD);
const MONGODB_URI = `mongodb+srv://${username}:${password}@pj9-frameworks-js.r6kzs.mongodb.net/?retryWrites=true&w=majority&appName=PJ9-Frameworks-JS`

// Middlewares
app.use(express.json()); // Permitir recibir JSON en peticiones
app.use(express.static('public'));
app.use(cors()); // Habilitar CORS para solicitudes externas
app.use(morgan('dev')); // Logger para ver las peticiones en la terminal

// Conectar a MongoDB con MongoClient
const connectDB = async () => {
    const uri = MONGODB_URI; // Usar la URI de la variable de entorno

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        // Conectar el cliente a MongoDB
        await client.connect();

        // Comprobar la conexión
        await client.db("admin").command({ ping: 1 });
        console.log("✅ Conexión exitosa a MongoDB con MongoClient!");

        // Almacenar el cliente en la aplicación para su uso posterior
        app.locals.dbClient = client;
    } catch (error) {
        console.error("❌ Error al conectar con MongoDB:", error);
        process.exit(1);
    }
};

app.post('/user/login', async (req, res) => {
    const { name, password } = req.body; // Obtener 'nombre' y 'password' desde el cuerpo de la solicitud
    console.log('Intento de login para:', name); // 🎨

    // Validar que ambos campos fueron proporcionados
    if (!name || !password) {
        return res.status(400).json({ error: 'Nombre y contraseña son requeridos' });
    }

    try {
        // Obtener el cliente de la base de datos desde app.locals
        const client = app.locals.dbClient;
        const db = client.db('PJ9-Database'); // Usar la base de datos predeterminada
        const usersCollection = db.collection('Users-Collection'); // Seleccionar la colección 'Users-Collection'
        const collections = await db.listCollections().toArray();
        console.log('Colecciones disponibles:', collections.map(c => c.name));

        // Buscar al usuario en la colección por su 'name'
        const user = await usersCollection.findOne({ name });
        console.log('Resultado de la consulta:', user); // 🎨

        if (!user) {
            console.log(name);
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Comparar la contraseña usando bcrypt
        const match = (password === user.password) ? true : false;

        if (!match) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Devolver el usuario encontrado (sin la contraseña)
        const { password: userPassword, ...userWithoutPassword } = user; // Excluir la contraseña del usuario
        res.json(userWithoutPassword);

    } catch (error) {
        console.error('❌ Error al buscar el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('🚀 Servidor Express y MongoDB Atlas funcionando correctamente!');
});

// Iniciar el servidor después de conectar a MongoDB
const PORT = process.env.PORT || 3000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Servidor corriendo en http://localhost:${PORT}/login.html`);
    });
});
