import { Application, Request, Response } from 'express';
import { Db } from './db';
import * as MongoDb from 'mongodb';
import * as cors from 'cors';

export class CustomerRoutes {
  apiRoutes: any;
  customerRoutes: any;

  init(app: Application, exp: any) {
    const db: Db = new Db();
    const defaultSort: any = { sortOrder: 1 };
    const wherePredicate: any = {};
    const ObjectID = MongoDb.ObjectID;

    this.apiRoutes = exp.Router();
    this.customerRoutes = exp.Router();

    app.use(cors({ origin: 'http://localhost:4200'}));

    this.apiRoutes.use('/customers', this.customerRoutes);

    /**
     * Get all customers
     */
    this.customerRoutes.get('/', (req: Request, res: Response) => {
      db.get(
        req,
        res,
        wherePredicate,
        defaultSort,
        'Failed to get the customers.'
      );
    });

    /**
     * Get selected customer
     */
    this.customerRoutes.get('/:id', (req: Request, res: Response) => {
      let query = { _id: null };
      query = Object.assign(query, wherePredicate);
      query._id = new ObjectID(req.params.id);

      db.getOne(req, res, query, 'Failed to get the customer.');
    });

    /**
     * Save a customer. (Used for both POST and PUT)
     */
    this.customerRoutes.post('/', (req: Request, res: Response) => {
      if (!req.body) {
        return res.sendStatus(400);
      }
      if (!req.body.firstName) {
        return res
          .status(500)
          .json({ success: false, message: 'First Name is required.' });
      }
      if (!req.body.lastName) {
        return res
          .status(500)
          .json({ success: false, message: 'Last Name is required.' });
      }

      if (
        req.body._id &&
        req.body._id !== null &&
        req.body._id !== '' &&
        req.body._id !== undefined
      ) {
        const updateDoc = Object.assign({}, req.body);
        delete updateDoc._id;

        db.update(req, res, updateDoc, 'Failed to update the customer.');
      } else {
        const entity = req.body;
        db.create(req, res, entity, 'Failed to create a customer.');
      }
    });

    /**
     * Update a customer.
     */
    this.customerRoutes.put('/:id', (req: Request, res: Response) => {
      const updateDoc = Object.assign({}, req.body);
      delete updateDoc._id;

      db.update(req, res, updateDoc, 'Failed to update the customer.');
    });

    /**
     * Delete a customer.
     */
    this.customerRoutes.delete('/:id', (req: Request, res: Response) => {
      db.delete(req, res, 'Failed to delete the customer.');
    });

    /**
     * Set the default api prefix.
     */
    app.use('/api', this.apiRoutes);
  }
}
