// implement your API here
const express = require("express");

const greeter = require("./greeter.js");

const server = express();
server.use(express.json());

const db = require("./data/db");

server.get("/", (req, res) => {
    res.send("What's good?");
});

server.get("/greet", greeter);

server.get("/api/users", (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res
                .status(500)
                .json({ message: "Sorry"})
        })
})

server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;

    db.findById(id).then(user => {
        res.status(200).json(user);
    })
})

server.post("/api/users", async (req, res) => {
    try {
        const userData = req.body;
        const userId = await db.insert(userData);
        res.status(201).json(userId);
    } catch (error) {
        res.status(500).json({ message: "error creating user", error})
    }
})

server.delete("/api/users/:id", (req, res) => {
    const {id} = req.params;

    db.remove(id)
        .then(count => {
            if(count) {
                res.status(200).json(count);
            }
            else {
                res.status(404).json({ message: "user not found" })
            }
        })
        .catch(err => {
            res.status(500).json({ message: "error deleting user" })
        })
})

server.put("/api/users/:id", (req, res) => {
    const {id} = req.params;

    db.update(id, req.body)
        .then(count => {
            if(count) {
                res.status(200).json(count);
            }
            else {
                res.status(404).json({ message: "user not found" })
            }
        })
        .catch(err => {
            res.status(500).json({ message: "error updating user"})
        })
})

server.get('/users', (req, res) => {
    console.dir(req, { depth: 1 });
    const { id } = req.query;
  
    if (id) {
      db.findById(id).then(users => res.send(users));
    } else {
      db.find().then(users => res.send(users));
    }
  });

server.get("/greet/:person", (req, res) => {
    const person = req.params.person;
    res.json({hello: person});
})

server.listen(9001, () => console.log("the server is on!"));