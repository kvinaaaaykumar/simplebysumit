import React, { useState, useEffect } from "react";
import axios from "axios";

// const link = "http://localhost:8080"

const link = import.meta.env.VITE_API_URL;



const App = () => {
  const [people, setPeople] = useState([]);
  const [formData, setFormData] = useState({ name: "", age: "", gender: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch People
  useEffect(() => {
    axios
      .get(`${link}/api/people`)
      .then((response) => setPeople(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Update Person
      axios
        .put(`${link}/api/people/${editingId}`, formData)
        .then((response) => {
          setPeople((prev) =>
            prev.map((person) =>
              person._id === editingId ? response.data : person
            )
          );
          setEditingId(null);
          setFormData({ name: "", age: "", gender: "" });
        })
        .catch((error) => console.error("Error updating person:", error));
    } else {
      // Create Person
      axios
        .post(`${link}/api/people`, formData)
        .then((response) => {
          setPeople((prev) => [...prev, response.data]);
          setFormData({ name: "", age: "", gender: "" });
        })
        .catch((error) => console.error("Error creating person:", error));
    }
  };

  // Handle Delete
  const handleDelete = (id) => {
    axios
      .delete(`${link}/api/people/${id}`)
      .then(() => {
        setPeople((prev) => prev.filter((person) => person._id !== id));
      })
      .catch((error) => console.error("Error deleting person:", error));
  };

  // Handle Edit
  const handleEdit = (person) => {
    setEditingId(person._id);
    setFormData({ name: person.name, age: person.age, gender: person.gender });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>People Management</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          required
        />
        <select
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <button type="submit">{editingId ? "Update" : "Add"}</button>
      </form>
      <ul>
        {people.map((person) => (
          <li key={person._id}>
            {person.name} - {person.age} - {person.gender}
            <button onClick={() => handleEdit(person)}>Edit</button>
            <button onClick={() => handleDelete(person._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
