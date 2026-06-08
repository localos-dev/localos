import { Router, type IRouter } from "express";
import healthRouter from "./health";
import statusRouter from "./status";
import projectsRouter from "./projects";
import chatsRouter from "./chats";
import filesRouter from "./files";
import knowledgeRouter from "./knowledge";
import modelsRouter from "./models";
import pullStreamRouter from "./pull-stream";
import setupRouter from "./setup";
import filesystemRouter from "./filesystem";
import chatStreamRouter from "./chat-stream";
import paymentRouter from "./payment";

const router: IRouter = Router();

router.use(healthRouter);
router.use(statusRouter);
router.use(projectsRouter);
router.use(chatsRouter);
router.use(filesRouter);
router.use(knowledgeRouter);
router.use(modelsRouter);
router.use(pullStreamRouter);
router.use(setupRouter);
router.use(filesystemRouter);
router.use(chatStreamRouter);
router.use(paymentRouter);

export default router;
