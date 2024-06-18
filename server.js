const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

function loadEndpoints() {
    const configPath = './config/endpoint.json';
    const endpointsConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    endpointsConfig.endpoints.forEach(endpoint => {
        const basePath = path.join('./config', endpoint.path);
        const responseConfig = JSON.parse(fs.readFileSync(path.join(basePath, 'response.json'), 'utf8'));
        const requestConfig = JSON.parse(fs.readFileSync(path.join(basePath, 'request.json'), 'utf8'));
        //const headerConfig = JSON.parse(fs.readFileSync(path.join(basePath, 'header.json'), 'utf8'));

        app[endpoint.method](endpoint.path, (req, res) => {

            // if (!validateHeaders(req.headers, headerConfig)) {
            //     console.log('Request Headers:', req.headers);
            //     return res.status(400).send({ error: "Invalid headers" });
            // }

            if (!validateBody(req.body, requestConfig.bodyStructure)) {
                console.log('Request Body:', req.body);
                return res.status(400).send({ error: "Invalid request body" });
            }

            res.status(responseConfig.status).json(responseConfig.body);
        });
    });
}

function validateHeaders(headers, requiredHeaders) {
    return Object.keys(requiredHeaders).every(key => headers[key] && headers[key] === requiredHeaders[key]);
}

function validateBody(body, structure) {
    function validateField(body, structure) {
        return Object.keys(structure).every(key => {
            const spec = structure[key];
            if (typeof spec === 'object' && !Array.isArray(spec) && spec !== null) {
                if (spec.type === undefined) {
                    return key in body && validateField(body[key], spec);
                } else {
                    if (spec.isRequired && !(key in body)) {
                        return false;
                    }
                    if (key in body) {
                        if ('type' in spec) {
                            if (spec.type === "Date") {
                                body[key] = new Date(body[key])
                                if (!(body[key] instanceof Date)) {
                                    return false;
                                }
                            } else if (typeof body[key] !== spec.type) {
                                return false;
                            }
                        }
                        if ('equals' in spec && spec.equals !== null && body[key] !== spec.equals) {
                            return false;
                        }
                    }
                    return true;
                }
            } else {
                return true;
            }
        });
    }
    return validateField(body, structure);
}



loadEndpoints();

const PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

try{
    const options = {
        key: fs.readFileSync(path.join(__dirname, 'certs', 'server.key')),
        cert: fs.readFileSync(path.join(__dirname, 'certs', 'server.crt'))
      };
    
    https.createServer(options, app).listen(HTTPS_PORT, () => {
        console.log(`HTTPS Server is running on port ${HTTPS_PORT}`);
    });
}catch (err) {
  console.warn('Could not find SSL certificates, falling back to HTTP:', err.message);
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
