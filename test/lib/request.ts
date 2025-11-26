import supertest from 'supertest';
import 'dotenv/config';

const port = process.env.PORT || 4000;
const baseURL = `http://localhost:${port}`;

export default supertest(baseURL);
