const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();


app.use(cors({
    origin: '*',  
  }));
  
app.use(bodyParser.json());


mongoose.connect("mongodb+srv://konapallisravani:Srav123@cluster2.9nyhm.mongodb.net/project?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));


const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true },
  clientName: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["Paid", "Unpaid", "Pending"], required: true },
});

const Invoice = mongoose.model("Invoice", invoiceSchema);


app.get("/invoices", async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoices" });
  }
});


app.post("/invoices", async (req, res) => {
  const { invoiceNumber, clientName, date, amount, status } = req.body;
  const invoice = new Invoice({ invoiceNumber, clientName, date, amount, status });
  try {
    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ message: "Error creating invoice" });
  }
});


app.put("/invoices/:id", async (req, res) => {
  const { id } = req.params;
  const { invoiceNumber, clientName, date, amount, status } = req.body;
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      { invoiceNumber, clientName, date, amount, status },
      { new: true }
    );
    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json(updatedInvoice);
  } catch (error) {
    res.status(400).json({ message: "Error updating invoice" });
  }
});


app.delete("/invoices/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(id);
    if (!deletedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json({ message: "Invoice deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting invoice" });
  }
});


const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
