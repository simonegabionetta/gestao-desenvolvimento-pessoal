import express from 'express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const app = express();

const userRoutes = require('./routes/userRoutes');
const goalRoutes = require('./routes/goalRoutes');
const projectRoutes = require('./routes/projectRoutes');
const mentorshipRoutes = require('./routes/mentorshipRoutes');
const improvementRoutes = require('./routes/improvementRoutes');
const learningRoutes = require('./routes/learningRoutes');
const noteRoutes = require('./routes/noteRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

app.use(express.json());

app.use('/users', userRoutes);
app.use('/goals', goalRoutes);
app.use('/projects', projectRoutes);
app.use('/mentorships', mentorshipRoutes);
app.use('/improvements', improvementRoutes);
app.use('/learning', learningRoutes);
app.use('/notes', noteRoutes);
app.use('/dashboard', dashboardRoutes);

// Swagger
const swaggerDocument = YAML.load(path.join(new URL('.', import.meta.url).pathname, '../resources/swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => res.send('API de Gestão de Desenvolvimento Pessoal e Profissional'));

export default app;
