import express, { Request } from "express";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3005;

app.get("/", (req: Request, res: Response) => {
  res.send("hello");
});

app.get("/tasks", async (_: Request, res: Response) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

function getCurrentDateTime() {
  return new Date().toISOString();
}

app.post("/tasks", async (req: Request, res: Response) => {
  const {
    category,
    title,
    description,
    image,
    points,
    assignee,
    admin,
    completed,
    published,
    dueAt,
  } = req.body;

  // const points = +req.body.points;
  if (!title || !assignee || !description) {
    return res.status(400).send({
      error:
        "Request payload is not valid. Title, assignee and description are required.",
    });
  }
  const newTask = await prisma.task.create({
    data: {
      category,
      title,
      description,
      image,
      points: Number(points),
      assignee,
      admin,
      completed,
      published,
      dueAt, // Expected ISO-8601 DateTime - "2012-04-23T18:25:43.511Z"
    },
  });

  return res.send(newTask);
});

app.put("/tasks/:id", (req: Request, res: Response) => {
  const { title, assignee, description, published } = req.body;
  const { id } = req.params;
  const updatedTask = { title, assignee, description, published };
  tasks[Number(id)] = updatedTask;
  res.send(tasks);
});

app.patch("/task/edit/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const { completed, image } = req.body;
  console.log(req.body)
  if (!completed || !image) {
    return res
      .status(400)
      .send({
        error:
          "Request payload is not valid. Completed and Image are required.",
      });
  }

  const result = await prisma.task.update({
    where: {
      id: +id,
    },
    data: {
      completed,
      image,
    },
  });

  return res.send(result);
});

app.get("/tasks/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const task = await prisma.task.findUnique({
    where: {
      id: Number(id),
    },
  })

  // const foundTask = tasks[Number(id)];
  res.send(task);
});

app.delete("/tasks/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  tasks.splice(Number(id), 1);
  res.send(tasks);
});


app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
