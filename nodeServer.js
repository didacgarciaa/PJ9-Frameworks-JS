require('dotenv').config();
const http = require('http');
const { MongoClient, ServerApiVersion } = require('mongodb');
const url = require('url');
const path = require('path');
const fs = require('fs');
const pug = require('pug');

const PORT = process.env.PORT || 3000;
const username = encodeURIComponent(process.env.DB_USER);
const password = encodeURIComponent(process.env.DB_PASSWORD);
const MONGODB_URI = `mongodb+srv://${username}:${password}@pj9-frameworks-js.r6kzs.mongodb.net/?retryWrites=true&w=majority&appName=PJ9-Frameworks-JS`;

let db;

const CONTENT_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

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
    db = client.db('PJ9-Database');
    return client;
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
          const contentType = req.headers['content-type'] || '';
          
          if (contentType.includes('application/json')) {
            const parsed = body ? JSON.parse(body) : {};
            resolve(parsed);
          } else if (contentType.includes('application/x-www-form-urlencoded')) {
            const formData = {};
            body.split('&').forEach(pair => {
              const [key, value] = pair.split('=');
              formData[decodeURIComponent(key)] = decodeURIComponent(value);
            });
            resolve(formData);
          } else {
            try {
              const parsed = body ? JSON.parse(body) : {};
              resolve(parsed);
            } catch (jsonError) {
              const formData = {};
              body.split('&').forEach(pair => {
                if (!pair) return;
                const [key, value] = pair.split('=');
                if (key) formData[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
              });
              resolve(formData);
            }
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  };

const sendResponse = (res, statusCode, data, contentType = 'application/json') => {
  res.writeHead(statusCode, { 'Content-Type': contentType });
  
  if (contentType === 'application/json') {
    res.end(JSON.stringify(data));
  } else {
    res.end(data);
  }
};

const serveStaticFile = (res, filePath, contentType) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      sendResponse(res, 404, { error: 'Archivo no encontrado' });
    } else {
      sendResponse(res, 200, data, contentType);
    }
  });
};

const renderPugTemplate = (res, templatePath) => {
  try {
    const html = pug.renderFile(path.join(__dirname, templatePath));
    sendResponse(res, 200, html, 'text/html');
  } catch (error) {
    console.error(`Error al renderizar ${templatePath}:`, error);
    sendResponse(res, 500, { error: 'Error interno del servidor' });
  }
};

const routeHandlers = {
  'GET /': (req, res) => renderPugTemplate(res, 'public/landing.pug'),
  'GET /login': (req, res) => renderPugTemplate(res, 'public/login.pug'),
  'GET /vue-migration': (req, res) => renderPugTemplate(res, 'public/vue-migration.pug'),
  'GET /admin': (req, res) => renderPugTemplate(res, 'public/admin.pug'),
  'GET /client': (req, res) => renderPugTemplate(res, 'public/client.pug'),
  'GET /dragndrop': (req, res) => renderPugTemplate(res, 'public/drag&drop.pug'),

  'POST /user/login': async (req, res) => {
    try {
        const { name, password } = await parseBody(req);
        
        if (!name || !password) {
        return sendResponse(res, 400, { error: "Se requieren nombre y contraseña" });
        }

        const usersCollection = db.collection('Users-Collection');
        const user = await usersCollection.findOne({ name });

        if (!user) {
        return sendResponse(res, 404, { error: 'Usuario no encontrado' });
        }

        const isValidPassword = user.password === password;
        
        if (!isValidPassword) {
        return sendResponse(res, 401, { error: 'Contraseña incorrecta' });
        }

        sendResponse(res, 200, { 
        role: user.role,
        name: user.name
        });
    } catch (error) {
        console.error('Error en login:', error);
        sendResponse(res, 500, { error: 'Error interno del servidor' });
    }
   },

  'POST /user/create': async (req, res) => {
    try {
      const { name, password, role } = await parseBody(req);

      if (!name || !password || !role) {
        return sendResponse(res, 400, { error: "Se requieren nombre, contraseña y rol" });
      }

      const usersCollection = db.collection('Users-Collection');
      
      const existingUser = await usersCollection.findOne({ name });
      if (existingUser) {
        return sendResponse(res, 409, { error: 'El usuario ya existe' });
      }
      
      const newUser = { name, role, password };
      const result = await usersCollection.insertOne(newUser);
      
      sendResponse(res, 201, { 
        message: 'Usuario creado exitosamente', 
        id: result.insertedId 
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      sendResponse(res, 500, { error: 'Error interno del servidor' });
    }
  },
  'DELETE /user/delete': async (req, res) => {
    try {
      const { name } = await parseBody(req);
      
      if (!name) {
        return sendResponse(res, 400, { error: "Se requiere el nombre del usuario" });
      }

      const usersCollection = db.collection('Users-Collection');
      const result = await usersCollection.deleteOne({ name });

      if (result.deletedCount === 0) {
        return sendResponse(res, 404, { error: 'Usuario no encontrado' });
      }

      sendResponse(res, 200, { message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      sendResponse(res, 500, { error: 'Error interno del servidor' });
    }
  },
  'PUT /user/update': async (req, res) => {
    try {
      const { name, password, role } = await parseBody(req);
      
      if (!name) {
        return sendResponse(res, 400, { error: "Se requiere el nombre del usuario" });
      }

      if (!password && !role) {
        return sendResponse(res, 400, { error: "Se requiere al menos un campo para actualizar (contraseña o rol)" });
      }

      const updateFields = {};
      if (password) updateFields.password = password;
      if (role) updateFields.role = role;

      const usersCollection = db.collection('Users-Collection');
      const result = await usersCollection.updateOne(
        { name },
        { $set: updateFields }
      );

      if (result.matchedCount === 0) {
        return sendResponse(res, 404, { error: 'Usuario no encontrado' });
      }

      sendResponse(res, 200, { message: 'Usuario actualizado exitosamente' });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      sendResponse(res, 500, { error: 'Error interno del servidor' });
    }
  }
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const ext = path.extname(pathname);
  if (CONTENT_TYPES[ext]) {
    const filePath = path.join(__dirname, 'public', pathname);
    return serveStaticFile(res, filePath, CONTENT_TYPES[ext]);
  }

  const routeKey = `${req.method} ${pathname}`;
  const routeHandler = routeHandlers[routeKey];
  
  if (routeHandler) {
    return routeHandler(req, res);
  }

  sendResponse(res, 404, { error: 'Ruta no encontrada' });
});

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
}).catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});