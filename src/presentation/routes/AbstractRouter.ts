import { Router } from 'express';
import { IEndPointsRouter } from 'interfaces/presentation/router';

export default abstract class AbstractRouter implements IEndPointsRouter {
  router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  protected abstract _routes(): Promise<void>;

  get routes() {
    return this._routes;
  }

  set routes(method: () => Promise<void>) {
    this._routes = method;
  }
}
