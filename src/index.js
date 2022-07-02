const express = require("express");
const { v4: uuidV4 } = require("uuid");

const app = express();
app.use(express.json());

const customers = [];

function verifyIfExistsAccountCPF(req, res, next) {
  const { cpf } = req.headers;

  const targetCustomer = customers.find((customer) => customer.cpf === cpf);

  if (!targetCustomer) {
    return res.status(400).json({
      message: "Customer not found",
    });
  }

  req.customer = targetCustomer;

  return next();
}

/**
 * Customer Entity
 * cpf - string
 * name - string
 * id - uuid
 * statement - array[]
 */
app.post("/account", (req, res) => {
  const { cpf, name } = req.body;

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

app.get("/statement", verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;

  return res.json(customer.statement);
});

app.post("/deposit", verifyIfExistsAccountCPF, (req, res) => {
  const {
    customer,
    body: { description, amount },
  } = req;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit",
  };

  customer.statement.push(statementOperation);

  return res.status(201).json(statementOperation);
});

app.listen(3333);
