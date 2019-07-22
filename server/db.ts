import * as mongodb from 'mongodb';
import { ExceptionService } from './exceptionService';
import { ResponseBase } from './ResponseBase';

const ObjectID = mongodb.ObjectID;
const MongoClient = mongodb.MongoClient;

export class Db {
  dbUrl = 'mongodb://localhost:27017';
  dbScope = { db: null, repo: null };
  exceptionService: ExceptionService;

  constructor() {
    this.exceptionService = new ExceptionService();
  }


  async getDb(next: any) {
    if (this.dbScope.db) {
      next(null, this.dbScope);
      return;
    }

    const client = new MongoClient(this.dbUrl, { useNewUrlParser: true });

    try {
      // throw new Error('King error...');
      await client.connect();

      const db = client.db('httpbasedemo');
      this.dbScope.db = db;
      this.dbScope.repo =  db.collection('customers');

      next(null, this.dbScope);
    } catch (error) {
      console.log('Error connecting to MongoDB: ', error);
      next(error, null);
    }
  }

  /**
   * Get all the objects for the requested route.
   * @param req The HTTP request.
   * @param res The HTTP response.
   * @param wherePredicate The MongoDB where predicate. Ex: { tag: 'john' }
   * @param sortQuery The MongoDB query to be used for sorting.
   * @param errmsg The error message to be returned.
   * @param next The optional callback function.
   */
  get(req: any, res: any, wherePredicate: any, sortQuery: any, errmsg: string, next: any = null) {
    const self = this;
    this.getDb((err: any, db: any) => {
      if (err) {
        self.exceptionService.handleError(res, err.message, errmsg);
      } else {
        const repo = db.repo.find(wherePredicate);

        if (sortQuery) {
          repo.sort(sortQuery);
        }

        repo.toArray((error: any, docs: any) => {
          if (error) {
            self.exceptionService.handleError(res, error.message, errmsg);
          } else {
            if (next) {
              next (null, res, docs);
            } else {
              const response = new ResponseBase();
              response.success = true;
              response.data = docs;

              res.status(200).json(response);
            }
          }
        });
      }
    });
  }

  /**
   * Get one object from the request.
   * @param req The HTTP request.
   * @param res The HTTP response.
   * @param wherePredicate The MongoDB where predicate. Ex: { tag: 'john' }
   * @param errmsg The error message to be returned.
   * @param next The optional callback function.
   */
  getOne(req: any, res: any, wherePredicate: any, errmsg: string, next: any = null) {
    const self = this;
    this.getDb((err: any, db: any) => {
      if (err) {
        self.exceptionService.handleError(res, err.message, errmsg);
      } else {
        db.repo.findOne(wherePredicate, (error: any, doc: any) => {
          if (error) {
            self.exceptionService.handleError(res, error.message, errmsg);
          } else {
            if (next) {
              next(null, res, doc);
            } else {
              const response = new ResponseBase();
              response.success = true;
              response.data = doc;

              res.status(200).json(response);
            }
          }
        });
      }
    });
  }

  /**
   * Create the selected object.
   * @param req The HTTP request.
   * @param res The HTTP response.
   * @param payload The JSON object to update.
   * @param errmsg The error message to be returned.
   * @param next The optional callback function.
   */
  create(req: any, res: any, payload: any, errmsg: string, next: any = null) {
    const self = this;
    this.getDb((err: any, db: any) => {
      if (err) {
        self.exceptionService.handleError(res, err.message, errmsg);
      } else {
        db.repo.insertOne(payload, (error: any, doc: any) => {
          if (error) {
              self.exceptionService.handleError(res, error.message, errmsg);
          } else {
            if (next) {
                next(null, res, doc);
            } else {
              const response = new ResponseBase();
              response.success = true;
              response.data = doc.ops[0];

              res.status(200).json(response);
            }
          }
        });
      }
    });
  }

  /**
   * Update the selected object.
   * @param req The HTTP request.
   * @param res The HTTP response.
   * @param payload The JSON object to update.
   * @param errmsg The error message to be returned.
   * @param next The optional callback function.
   */
  update(req: any, res: any, payload: any, errmsg: string, next: any = null) {
    const self = this;
    let id = req.params.id;

    if (!id) {
      id = req.body._id;
    }

    const wrappedPayload = {
      $set: payload
    };

    this.getDb((err: any, db: any) => {
      if (err) {
        self.exceptionService.handleError(res, err.message, errmsg);
      } else {
        db.repo.findOneAndUpdate({ _id: new ObjectID(id) },
          wrappedPayload, { returnOriginal: false, upsert: true }, (error: any, doc: any) => {
          if (error) {
            self.exceptionService.handleError(res, error.message, errmsg);
          } else {
            if (next) {
              next(null, res, doc);
            } else {
              const response = new ResponseBase();
              response.success = true;
              response.message = 'Update was successful!';
              response.data = doc.value;

              res.status(200).json(response);
            }
          }
        });
      }
    });
  }

  /**
   * Delete the selected object from the database.
   * @param req The HTTP request.
   * @param res The HTTP response.
   * @param errmsg The error message to be returned.
   * @param next The optional callback function.
   */
  delete(req: any, res: any, errmsg: string, next: any = null) {
    const self = this;
    this.getDb((err: any, db: any) => {
      if (err) {
        self.exceptionService.handleError(res, err.message, errmsg);
      } else {
        db.repo.deleteOne({ _id: new ObjectID(req.params.id) }, (error, result) => {
          if (error) {
            self.exceptionService.handleError(res, error.message, errmsg);
          } else {
            if (next) {
              next (null, res, result);
            } else {
              const response = new ResponseBase();
              response.success = true;

              res.status(204).json(response);
            }
          }
        });
      }
    });
  }
}
