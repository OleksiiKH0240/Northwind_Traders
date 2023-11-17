import { Router } from "express";
import search from "controlers/Search";
import searchMiddleware from "middlewares/SearchMiddleware";


const searchRouter = Router();

searchRouter.get("/search", searchMiddleware.queryParamsValidation, search.getSearchResult);

export default searchRouter;
