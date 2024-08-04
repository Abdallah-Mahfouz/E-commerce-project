import connectionDB from "../DB/connectionDB.js";
import * as Routers from "../Src/Modules/index.Routes.js";
import { AppError } from "../Src/utils/appError.js";
import { globalError } from "../Src/utils/globalError.js";
import { deleteFromCloudinary } from "./utils/deleteFromCloudinary.js";
import { deleteFromDB } from "./utils/deleteFromDB.js";
import cors from "cors";
//================================================================
export const initApp = (app, express) => {
  const port = process.env.PORT || 3001;
  //===================
  connectionDB();
  //===================
  // Middleware setup
  const corsOptions = {
    origin: "*",
    credentials: true, //access-control-allow-credentials:true
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  };
  app.use(cors(corsOptions));
  //===================
  app.use((req, res, next) =>{
    if(req.originalUrl=="/order/webhook"){
      next();
    }else{
      express.json()(req, res, next);
    }
  });
  // =================
  // Base route
  app.get("/", (req, res) => {
    res.status(200).json({ msg: "Welcome to E-commerce Project" });
  });
  //===================
  app.use("/user", Routers.userRouter);
  app.use("/category", Routers.categoryRouter);
  app.use("/subCategory", Routers.subCategoryRouter);
  app.use("/brand", Routers.brandRouter);
  app.use("/product", Routers.productRouter);
  app.use("/coupon", Routers.couponRouter);
  app.use("/cart", Routers.cartRouter);
  app.use("/order", Routers.orderRouter);
  app.use("/review", Routers.reviewRouter);
  app.use("/wishList", Routers.wishListRouter);
  //===================

  //===================
  // error route handler
  app.use("*", (req, res, next) =>
    next(new AppError(`invalid route${req.originalUrl}`, 404))
  );
  //===================
  // global error handler middleware
  app.use(globalError, deleteFromCloudinary, deleteFromDB);
  //================================================================
  app.listen(port, () => console.log(`app listening on port ${port}!`));
};
