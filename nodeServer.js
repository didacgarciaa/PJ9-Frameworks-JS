require('dotenv').config();
const http = require('http');
const { MongoClient, ServerApiVersion } = require('mongodb');
const url = require('url');
const path = require('path');
const fs = require('fs');
const pug = require('pug');


const username = encodeURIComponent(process.env.DB_USER);
const password = encodeURIComponent(process.env.DB_PASSWORD);
const MONGODB_URI = `mongodb+srv://${username}:${password}@pj9-frameworks-js.r6kzs.mongodb.net/?retryWrites=true&w=majority&appName=PJ9-Frameworks-JS`;

let dbClient;

const connectDB = async () => {
    const client = new MongoClient(MONGODB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Conexión exitosa a MongoDB!");
        dbClient = client;
    } catch (error) {
        console.error("Error al conectar con MongoDB:", error);
        process.exit(1);
    }
};

const parseBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const parsed = JSON.parse(body);
                resolve(parsed);
            } catch (error) {
                reject(error);
            }
        });
    });
};

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }


    let pathname = `.${parsedUrl.pathname}`;
    const ext = path.extname(pathname);
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif') {
        const filePath = path.join(__dirname, 'public', parsedUrl.pathname);

        fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Imagen no encontrada');
        } else {
            let contentType = 'image/jpeg';
            if (ext === '.png') contentType = 'image/png';
            if (ext === '.gif') contentType = 'image/gif';

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
        });
        return;
    }
    
    if (req.method === 'GET' && parsedUrl.pathname === '/') {
        try {
            const html = pug.renderFile(path.join(__dirname, 'public/landing.pug'));
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        } catch (error) {
            console.error('Error al renderizar PUG:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error interno del servidor');
        }
        return;
    }

    if (req.method === 'GET' && parsedUrl.pathname === '/login') {
        try {
            const html = pug.renderFile(path.join(__dirname, 'public/login.pug'));
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        } catch (error) {
            console.error('Error al renderizar login.pug:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error interno del servidor');
        }
        return;
    }

    if (req.method === 'GET' && parsedUrl.pathname === '/admin') {
        try {
            const html = pug.renderFile(path.join(__dirname, 'public/admin.pug'));
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        } catch (error) {
            console.error('Error al renderizar admin.pug:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error interno del servidor');
        }
        return;
    }
    if (req.method === 'GET' && parsedUrl.pathname === '/client') {
        try {
            const html = pug.renderFile(path.join(__dirname, 'public/client.pug'));
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        } catch (error) {
            console.error('Error al renderizar client.pug:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error interno del servidor');
        }
        return;
    }

    if (req.method === 'GET' && parsedUrl.pathname === '/dragndrop') {
        try {
            const html = pug.renderFile(path.join(__dirname, 'public/drag&drop.pug'));
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        } catch (error) {
            console.error('Error al renderizar drag and drop.pug:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error interno del servidor');
        }
        return;
    }

    if (req.method === 'POST' && parsedUrl.pathname === '/user/login') {
        try {
            const { name, password } = await parseBody(req);
            console.log('Intento de login para:', name);

            if (!name || !password) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "S'han d'introduir nombre, contraseña y rol" }));
                return;
            }

            const db = dbClient.db('PJ9-Database');
            const usersCollection = db.collection('Users-Collection');
            const user = await usersCollection.findOne({ name });

            if (!user) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Usuari no trobat' }));
                return;
            }

            if (password !== user.password) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Contrasenya incorrecta' }));
                return;
            }

            const { password: userPassword, ...userWithoutPassword } = user;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(userWithoutPassword));

        } catch (error) {
            console.error('Error al buscar el usuari:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error intern del servidor' }));
        }

    } else if (req.method === 'POST' && parsedUrl.pathname === '/user/create') {
        try {
            const { name, password, role } = await parseBody(req);

            if (!name || !password || !role) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "S'han d'introduir nombre, contraseña y rol" }));
                return;
            }

            const db = dbClient.db('PJ9-Database');
            const usersCollection = db.collection('Users-Collection');

            const existingUser = await usersCollection.findOne({ name });
            if (existingUser) {
                res.writeHead(409, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'El usuari ja existeix' }));
                return;
            }

            const newUser = { name, role, password };
            const result = await usersCollection.insertOne(newUser);
            console.log('Usuari creat:', result.insertedId);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Usuari creat exitosament', id: result.insertedId }));

        } catch (error) {
            console.error('Error al crear el usuari:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error intern del servidor' }));
        }

    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ruta no trobada' }));
    }
});


connectDB().then(() => {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Servidor escoltant al port ${PORT}`);
    });
});
