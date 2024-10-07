import React, { useState } from "react";
import axios from "axios";

const AdminCrud: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "create" | "list" | "delete" | "update" //paso los tipos de datos q quiero para la activetab
  >("list"); //setActiveTab es la fucnión q cambia el valor de la activetab. "list" o la que elija, será la que estará activa al cargarse el componente.
  const [formData, setFormData] = useState({
    //formData: variable almacena los datos que el usuario ingresa en el formulario(inica string vacío), setFormData: función que usamos para actualizar formData, useState: el valor inicial de la variable
    admin_name: "",
    admin_email: "",
    admin_pwd: "",
    admin_role: "",
  });
  const [admins, setAdmins] = useState([]); //cada hook requi'ere siempre una variable en la que almacenatrá los datos y una funcion que los actualizará. El valor inicial de la variable o estado inicial será un array vacío, o un string vacío
  const [adminId, setAdminId] = useState("");

  // Obtener el token de administrador desde localStorage (si no da error la solicitud)
  const adminToken = localStorage.getItem("adminToken"); //lo obtengo de dnd lo almacené en el login

  // Configuración de los headers(para la solicitud http) con el token de autorización
  const config = {
    headers: {
      Authorization: `Bearer ${adminToken}`, // Añadir el token JWT que  obtrenemos del local storage en el header
    },
  };

  // Manejar el cambio en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //el evento courre en un input
    setFormData({ ...formData, [e.target.name]: e.target.value }); //actualizo el estado cn el spread operator,copio el edo actual de ...formData con todo lo que contiene, para luego actualizar especificamente el que ha cambiado
  }; //e.target.name se refiere al elemento modificado (admin_name, admin_email, etc), e.target.value(valor que ingreso para ese campo)- [e.target.name] --> ver en apuntes: propiedades computadas

  // Función para crear un admin
  const handleCreate = async () => {
    try {
      await axios.post("http://localhost:5000/admin", formData, config); // Añadir config para enviar el token
      alert("Admin creado con éxito");

      // Limpiar los campos del formulario
      setFormData({
        admin_name: "",
        admin_email: "",
        admin_pwd: "",
        admin_role: "",
      });
    } catch (error: any) {
      console.error("Error al crear admin:", error.response || error.message);
      alert("Error al crear admin");
    }
  };

  // Función para listar admins
  const handleList = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admins", config); // Añadir config para enviar el token
      setAdmins(response.data);
    } catch (error: any) {
      //any- typescript requiere el tipo de dato, any admite todos
      console.error(
        //TODO: Usar Sentry para manejo de rrores en producción
        "Error al obtener la lista de admins:",
        error.response || error.message
      );
      alert("Error al obtener la lista de admins");
    }
  };

  // Función para eliminar admin
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/admin/${adminId}`, config); // Añadir config para enviar el token
      alert("Admin eliminado con éxito");
    } catch (error: any) {
      console.error(
        "Error al eliminar admin:",
        error.response || error.message
      );
      alert("Error al eliminar admin");
    }
  };

  const handleUpdate = async () => {
    const updatedData: any = {};

    // Solo agregar los campos que tienen un valor no vacío
    if (formData.admin_name) updatedData.admin_name = formData.admin_name;
    if (formData.admin_email) updatedData.admin_email = formData.admin_email;
    if (formData.admin_pwd) updatedData.admin_pwd = formData.admin_pwd;
    if (formData.admin_role) updatedData.admin_role = formData.admin_role;

    if (!adminId) {
      alert("Please provide the Admin ID to update.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/admin/${adminId}`,
        updatedData, // Solo los campos no vacíos se enviarán al backend
        config
      );
      alert("Admin updated successfully");

      // Limpiar los campos del formulario e ID
      setFormData({
        admin_name: "",
        admin_email: "",
        admin_pwd: "",
        admin_role: "",
      });
      setAdminId(""); // Limpiar el campo de ID si deseas
    } catch (error: any) {
      console.error("Error updating admin:", error.response || error.message);
      alert("Error updating admin");
    }
  };

  return (
    <div>
      <h1>Admin CRUD Panel</h1>

      {/* Tabs para cambiar entre operaciones - Cada botón es un active tab, le asigno a cada uno un valor  */}
      <div>
        <button onClick={() => setActiveTab("create")}>Create Admin</button>
        <button onClick={() => setActiveTab("list")}>Show Admins</button>
        <button onClick={() => setActiveTab("delete")}>Delete Admin</button>
        <button onClick={() => setActiveTab("update")}>Update Admin</button>
      </div>

      {/* Contenido basado en el tab seleccionado */}
      {activeTab === "create" && (
        <div>
          <h2>Create Admin</h2>
          <input
            type="text"
            name="admin_name"
            value={formData.admin_name || ""} //los campos vinculados a formdata no puede ser ni undefined, ni null
            placeholder="Nombre"
            onChange={handleChange}
          />
          <input
            type="email"
            name="admin_email"
            value={formData.admin_email || ""} // siempre tiene que haber un valor asignado al input, sea el ingresado o el strig vacío para después de actualizado
            placeholder="Email"
            onChange={handleChange}
          />
          <input
            type="password"
            name="admin_pwd"
            value={formData.admin_pwd || ""}  
            placeholder="Contraseña"
            onChange={handleChange}
          />
          <input
            type="text"
            name="admin_role"
            value={formData.admin_role || ""}  
            placeholder="Rol"
            onChange={handleChange}
          />
          <button onClick={handleCreate}>Add Admin</button>
        </div>
      )}

      {activeTab === "list" && (
        <div>
          <h2>Admins List</h2>
          <button onClick={handleList}>Show Admins</button>
          <ul>
            {admins.map((admin: any) => (
              <li key={admin.id}>{admin.admin_name}</li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "delete" && (
        <div>
          <h2>Delete Admin</h2>
          <input
            type="text"
            placeholder="ID del Admin"
            value={adminId} //los inputs vinculados al admin id no requieren el "" pq ya esta definido en const [adminId, setAdminId] = useState("");
            onChange={(e) => setAdminId(e.target.value)}
          />
          <button onClick={handleDelete}>Delete Admin</button>
        </div>
      )}

      {activeTab === "update" && (
        <div>
          <h2>Update Admin</h2>
          <input
            type="text"
            placeholder="ID del Admin"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
          />
          <input
            type="text"
            name="admin_name"
            value={formData.admin_name || ""} 
            placeholder="Nombre"
            onChange={handleChange}
          />
          <input
            type="email"
            name="admin_email"
            value={formData.admin_email || ""} 
            placeholder="Email"
            onChange={handleChange}
          />
          <input
            type="password"
            name="admin_pwd"
            value={formData.admin_pwd || ""} 
            placeholder="Contraseña"
            onChange={handleChange}
          />
          <input
            type="text"
            name="admin_role"
            value={formData.admin_role || ""} 
            placeholder="Rol"
            onChange={handleChange}
          />
          <button onClick={handleUpdate}>Delete Admin</button>
        </div>
      )}
    </div>
  );
};

export default AdminCrud;
