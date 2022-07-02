const express = require("express");
const { v4: uuidV4 } = require("uuid");

const app = express();
app.use(express.json());

const customers = [];

/**
 * cpf - string
 * name - string
 * id - uuid
 * statement - array[]
 */
app.post("/account", (req, res) => {
  const { cpf, name, statement } = req.body;

  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  if (customerAlreadyExists) {
    return res.status(400).json({
      error: "Customer already exists",
    });
  }

  const customerObject = {
    id: uuidV4(),
    cpf,
    name,
    statement: [],
  };

  customers.push(customerObject);

  return res.status(201).json(customerObject);
});

app.listen(3333);
