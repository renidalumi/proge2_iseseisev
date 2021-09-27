import express, {Request, Response, Application} from 'express';

import cors from 'cors';

const app: Application = express();
app.use(express.json());
app.use(cors());

const port = 3000;
const ok: number = 200;
const created: number = 201;
const responseCodes = {
    ok: 200,
    created: 201,
    noContent: 204,
    badRequest: 400,
    notFound: 404,
  };

  interface User {
    id: number;
    firstName: string;
    lastName: string;
  }

  interface Category {
    id: number;
    name: string;
    createdBy: number;
  }
  interface Activity {
    id: number;
    description: string;
    createdBy: number;
    category: number;
    visibility: string;
  }
  interface Db {
    users: User[];
    categories: Category[];
    activity: Activity[];
  }
  const db: Db = {
    users: [
      {
        id: 1,
        firstName: 'Juku',
        lastName: 'Juurikas',
      },
      {
        id: 2,
        firstName: 'Mari',
        lastName: 'Maasikas',
      },
    ],
    categories: [
      {
        id: 1,
        name: 'Vaba aeg',
        createdBy: 1,
      },
      {
        id: 2,
        name: 'Igav on',
        createdBy: 2,
      },
      {
        id: 3,
        name: 'Mis ma teen',
        createdBy: 2,
      },
    ],
    activity: [
      {
        id: 1,
        description: 'Mängin kaarte õe/vennaga',
        category: 1,
        createdBy: 1,
        visibility: 'Public',
      },
      {
        id: 2,
        description: 'Jooksen kolm ringi mäest üles alla',
        category: 1,
        createdBy: 1,
        visibility: 'Public',
      },
      {
        id: 3,
        description: 'Võtan riiulist raamatu ja loen',
        category: 1,
        createdBy: 1,
        visibility: 'Public',
      },
      {
        id: 4,
        description: 'Mängin nupumängu',
        category: 1,
        createdBy: 1,
        visibility: 'Public',
      },
      {
        id: 4,
        description: 'Lähen jalutama',
        category: 2,
        createdBy: 1,
        visibility: 'Public',
      },
    ],
  };
  

app.get('/ping', (req: Request, res: Response) => {
    res.status(responseCodes.ok).json({
        message: 'Hello world!',
    });
});

app.get('/users', (req: Request, res: Response) => {
    res.status(responseCodes.ok).json({
        users: db.users,
    });
});

app.get('/users/:id', (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    const user = db.users.find((element) => element.id === id);
    res.status(responseCodes.ok).json({
        user
    });
});

app.delete('/users/:id', (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    if (!id) {
      return res.status(responseCodes.badRequest).json({
        error: 'No valid id provided',
      });
    }
    const index = db.users.findIndex((element) => element.id === id);
    if (index < 0) {
      return res.status(responseCodes.badRequest).json({
        message: `User not found with id: ${id}`,
      });
    }
    db.users.splice(index, 1);
    return res.status(responseCodes.noContent).json({});
  });
  

app.post('/users', (req: Request, res: Response) => {
    const {firstName, lastName} = req.body;
    const id = db.users.length +1;
    db.users.push({
        id,
        firstName,
        lastName,
    });
    res.status(responseCodes.created).json({
        id,
    });
});

app.post('/users', (req: Request, res: Response) => {
    const { firstName, lastName } = req.body;
    if (!firstName) {
      return res.status(responseCodes.badRequest).json({
        error: 'First name is required',
      });
    }
    if (!lastName) {
      return res.status(responseCodes.badRequest).json({
        error: 'Last name is required',
      });
    }
    const id = db.users.length + 1;
    db.users.push({
      id,
      firstName,
      lastName,
    });
    return res.status(responseCodes.created).json({
      id,
    });
  });
  app.patch('/users/:id', (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    const { firstName, lastName } = req.body;
    if (!id) {
      return res.status(responseCodes.badRequest).json({
        error: 'No valid id provided',
      });
    }
    if (!firstName && !lastName) {
      return res.status(responseCodes.badRequest).json({
        error: 'Nothing to update',
      });
    }
    const index = db.users.findIndex((element) => element.id === id);
    if (index < 0) {
      return res.status(responseCodes.badRequest).json({
        error: `No user found with id: ${id}`,
      });
    }
    if (firstName) {
      db.users[index].firstName = firstName;
    }
    if (lastName) {
      db.users[index].lastName = lastName;
    }
    return res.status(responseCodes.noContent).json({});
  });

  app.get('/categories', (req: Request, res: Response) => {
    const { categories } = db;
    return res.status(responseCodes.ok).json({
      categories,
    });
  });

  app.get('/categories/:id', (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    if (!id) {
      return res.status(responseCodes.badRequest).json({
        error: 'No valid id provided',
      });
    }
    const category = db.categories.find((element) => element.id === id);
    if (!category) {
      return res.status(responseCodes.badRequest).json({
        error: `No category found with id: ${id}`,
      });
    }
    return res.status(responseCodes.ok).json({
      category,
    });
  });
  
  app.delete('/categories/:id', (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    if (!id) {
      return res.status(responseCodes.badRequest).json({
        error: 'No valid id provided',
      });
    }
    const index = db.categories.findIndex((element) => element.id === id);
    if (index < 0) {
      return res.status(responseCodes.badRequest).json({
        message: `Category not found with id: ${id}`,
      });
    }
    db.categories.splice(index, 1);
    return res.status(responseCodes.noContent).json({});
  });

  app.post('/categories', (req: Request, res: Response) => {
    const { name, createdBy } = req.body;
    if (!name) {
      return res.status(responseCodes.badRequest).json({
        error: 'Category name is required',
      });
    }
    if (!createdBy) {
      return res.status(responseCodes.badRequest).json({
        error: 'Created by id is required',
      });
    }
    const id = db.users.length + 1;
    db.categories.push({
      id,
      name,
      createdBy,
    });
    return res.status(responseCodes.created).json({
      id,
    });
  });

  app.patch('/categories/:id', (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    const { name } = req.body;
    if (!name) {
      return res.status(responseCodes.badRequest).json({
        error: 'Nothing to update',
      });
    }
    const index = db.categories.findIndex((element) => element.id === id);
    if (index < 0) {
      return res.status(responseCodes.badRequest).json({
        error: `No category found with id: ${id}`,
      });
    }
    db.categories[index].name = name;
    return res.status(responseCodes.noContent).json({});
  });
  
  app.get('/activity', (req: Request, res: Response) => {
    const { category } = req.query;
    const { activity } = db;
    if (!category) {
      return res.status(responseCodes.ok).json({
        activity,
      });
    }
    const foundCategory = db.categories.find((element) => element.name === category);
    if (!foundCategory) {
      return res.status(responseCodes.badRequest).json({
        error: `No ${category} found`,
      });
    }
    const activityInCategory = activity.filter((element) => element.category === foundCategory.id);
    if (!activityInCategory || activityInCategory.length < 1) {
      return res.status(responseCodes.badRequest).json({
        error: `No activity found in ${category}`,
      });
    }
    return res.status(responseCodes.ok).json({
        activity: activityInCategory,
    });
  });

  app.get('/activity/random', (req: Request, res: Response) => {
    const random = Math.round(Math.random() * (db.activity.length - 1));
    const excuse: Activity = db.activity[random];
    return res.status(responseCodes.ok).json({
      excuse,
    });
  });

  app.get('/activity/:id', (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    if (!id) {
      return res.status(responseCodes.badRequest).json({
        error: 'No valid id provided',
      });
    }
    const excuse = db.activity.find((element) => element.id === id);
    if (!excuse) {
      return res.status(responseCodes.badRequest).json({
        error: `No excuse found with id: ${id}`,
      });
    }
    return res.status(responseCodes.ok).json({
      excuse,
    });
  });

  app.delete('/activity/:id', (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    if (!id) {
      return res.status(responseCodes.badRequest).json({
        error: 'No valid id provided',
      });
    }
    const index = db.activity.findIndex((element) => element.id === id);
    if (index < 0) {
      return res.status(responseCodes.badRequest).json({
        message: `Excuse not found with id: ${id}`,
      });
    }
    db.activity.splice(index, 1);
    return res.status(responseCodes.noContent).json({});
  });

  app.post('/activity', (req: Request, res: Response) => {
    const {
      description,
      createdBy,
      category,
      visibility,
    } = req.body;
  
    if (!description) {
      return res.status(responseCodes.badRequest).json({
        error: 'Excuse description is required',
      });
    }
    if (!createdBy) {
      return res.status(responseCodes.badRequest).json({
        error: 'Created by id is required',
      });
    }
    if (!category) {
      return res.status(responseCodes.badRequest).json({
        error: 'Category id is required',
      });
    }
    if (!visibility) {
      return res.status(responseCodes.badRequest).json({
        error: 'Visibility is required',
      });
    }
    const id = db.activity.length + 1;
    const excuse: Activity = {
      id,
      description,
      createdBy,
      category,
      visibility,
    };
    db.activity.push(excuse);
    return res.status(responseCodes.created).json({
      id,
    });
  });
  app.patch('/activity/:id', (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    const { description, category, visibility } = req.body;
    if (!description && !category && !visibility) {
      return res.status(responseCodes.badRequest).json({
        error: 'Nothing to update',
      });
    }
    const index = db.activity.findIndex((element) => element.id === id);
    if (index < 0) {
      return res.status(responseCodes.badRequest).json({
        error: `No excuse found with id: ${id}`,
      });
    }
    if (description) {
      db.activity[index].description = description;
    }
    if (category) {
      db.activity[index].category = category;
    }
    if (visibility) {
      db.activity[index].visibility = visibility;
    }
  
    return res.status(responseCodes.noContent).json({});
  });

app.listen(port, () => {
    console.log('Server is running');
});