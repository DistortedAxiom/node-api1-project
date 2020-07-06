const express = require("express");
const shortid = require("shortid");

const server = express();

server.use(express.json());

let users = [
    {
        id: shortid.generate(),
        name: "Jane Doe",
        bio: "Not Tarzan's Wife, another Jane"
    },
    {
        id: shortid.generate(),
        name: "Allen",
        bio: "Office worker"
    },
]

server.get("/", (req, res) => {
    res.status(200).send("<h1>Welcome to the API</h1>");
});

server.get("/api/users", (req, res) => {

    if (res !== null) {
        res.json(users);
    }
    else {
        res.status(500).json({ errorMessage: "The users information could not be retrieved." })
    }

});

server.post("/api/users", (req, res) => {
    const newUser = req.body;

    if ((((newUser.name).length !== 0) && ((newUser.bio).length) !== 0)) {
        newUser.id = shortid.generate();
        users.push(newUser);
        res.status(201).json(newUser);
    }

    else if ((((newUser.name).length == 0) && ((newUser.bio).length) == 0)){
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    }

    else {
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database" })
    }
});

server.get('/api/users/:id', (req, res) => {
    const reqId = req.params.id;

    let filteredUser = users.filter(user => user.id == reqId)

    if (filteredUser.length < 1) {
        res.status(404).json({ message: "The user with the specified ID does not exist." })
    }

    else if (filteredUser[0] !== null){
        res.status(200).json(filteredUser)
    }

    else {
        res.status(500).json({ errorMessage: "The user information could not be retrieved." })
    }
});

server.delete('/api/users/:id', (req, res) => {
    const reqId = req.params.id;
    const deleted = users.find(user => user.id == reqId)

    users = users.filter(user => user.id !== reqId);

    if (deleted == undefined) {
        res.status(404).json({ message: "The user with the specified ID does not exist." })
    }

    else if (deleted != undefined) {
        res.status(200).json(deleted);
    }

    else {
        res.status(500).json({ errorMessage: "The user could not be removed" })
    }
})

server.put('/api/users/:id', (req, res) => {
    const reqId = req.params.id;

    const userExist = users.find(user => user.id == reqId)

    const input = req.body

    if (userExist == undefined) {
        res.status(404).json({ message: "The user with the specified ID does not exist." })
    }
    else if (userExist) {
        Object.assign(userExist, input);
        res.status(200).json(userExist)
    }
    else if ((((input.name).length == 0) && ((input.bio).length) == 0))  {
        res.status(400)
        .json({ errorMessage: "Please provide name and bio for the user." })
    }
    else {
        res.status(500).json({ errorMessage: "The user information could not be modified." })
    }
})

const PORT = 8000;
server.listen(PORT, () => console.log(`server running on port ${PORT}`));
