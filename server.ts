import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Application } from 'express';

import { CustomerRoutes } from './server/customer.routes';

const app: Application = express();
const customerRoutes: CustomerRoutes = new CustomerRoutes();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

customerRoutes.init(app, express);

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Api server running on http://localhost:${port}`);
});
