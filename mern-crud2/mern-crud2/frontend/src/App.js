import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const API =
    "https://your-render-backend-url.onrender.com/students";

  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState("");

  const getStudents = async () => {
    const res = await axios.get(API);
    setStudents(res.data);
  };

  useEffect(() => {
    getStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await axios.put(`${API}/${editId}`, {
        name,
        email
      });
      setEditId("");
    } else {
      await axios.post(API, {
        name,
        email
      });
    }

    setName("");
    setEmail("");

    getStudents();
  };

  const deleteStudent = async (id) => {
    await axios.delete(`${API}/${id}`);
    getStudents();
  };

  const editStudent = (student) => {
    setName(student.name);
    setEmail(student.email);
    setEditId(student._id);
  };

  return (
    <div>
      <h2>MERN CRUD</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <button>
          {editId ? "Update" : "Add"}
        </button>
      </form>

      <hr />

      {students.map((s) => (
        <div key={s._id}>
          <h3>{s.name}</h3>
          <p>{s.email}</p>

          <button onClick={() => editStudent(s)}>
            Edit
          </button>

          <button onClick={() => deleteStudent(s._id)}>
            Delete
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;