import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    clientName: "",
    date: "",
    amount: "",
    status: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");

  const apiUrl = "http://localhost:5000/invoices"; // Backend API URL

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    if (selectedStatus === "all") {
      setFilteredInvoices(invoices);
    } else {
      setFilteredInvoices(invoices.filter((invoice) => invoice.status === selectedStatus));
    }
  }, [selectedStatus, invoices]);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get(apiUrl);
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateInvoice(editingId, formData);
    } else {
      await createInvoice(formData);
    }
    setFormData({ invoiceNumber: "", clientName: "", date: "", amount: "", status: "" });
    setIsEditing(false);
    setEditingId(null);
    fetchInvoices();
  };

  const createInvoice = async (invoice) => {
    try {
      await axios.post(apiUrl, invoice);
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  const updateInvoice = async (id, updatedInvoice) => {
    try {
      await axios.put(`${apiUrl}/${id}`, updatedInvoice);
    } catch (error) {
      console.error("Error updating invoice:", error);
    }
  };

  const deleteInvoice = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      fetchInvoices();
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const handleEdit = (invoice) => {
    setIsEditing(true);
    setEditingId(invoice._id);
    setFormData({
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.clientName,
      date: invoice.date,
      amount: invoice.amount,
      status: invoice.status
    });
  };

  const handleStatusFilterChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  return (
    <div className="container">
      <h1>Invoice Management</h1>
      
    
      <div className="mb-4">
        <select
          name="statusFilter"
          value={selectedStatus}
          onChange={handleStatusFilterChange}
          className="form-select"
        >
          <option value="all">All</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

     
      <form onSubmit={handleSubmit} className="mb-4">
        <input
        className="mb-3"
          type="text"
          name="invoiceNumber"
          placeholder="Invoice Number"
          value={formData.invoiceNumber}
          onChange={handleInputChange}
          required
        />
        <input
        className="mb-3"
          type="text"
          name="clientName"
          placeholder="Client Name"
          value={formData.clientName}
          onChange={handleInputChange}
          required
        />
        <input
        className="mb-3"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          required
        />
        <input
        className="mb-3"
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleInputChange}
          required
        />
        <select
          className="m-3"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Status</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Pending">Pending</option>
        </select>
        <button type="submit" className="btn btn-primary">
          {isEditing ? "Update Invoice" : "Add Invoice"}
        </button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Invoice Number</th>
            <th>Client Name</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.map((invoice) => (
            <tr key={invoice._id}> 
              <td>{invoice.invoiceNumber}</td>
              <td>{invoice.clientName}</td>
              <td>{invoice.date}</td>
              <td>{invoice.amount}</td>
              <td>{invoice.status}</td>
              <td>
                <button
                  className="btn btn-secondary m-2"
                  onClick={() => handleEdit(invoice)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteInvoice(invoice._id)} 
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
