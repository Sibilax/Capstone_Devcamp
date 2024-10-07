import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Necesito Link de react-router-dom para la navegación entre páginas
import { FaSpinner } from "react-icons/fa";

//  interfaz para representar los blogs (similar al modelo del backend pero solo con lo necesario para la solicitud desde el front)
interface Blog {
  blog_id: number;
  blog_title: string;
  blog_content: string;
}

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]); // estado inicial de blogs para almacenar una lista de blogs, indico el tipo <Blog[]> y  valor incial ([])

  const [loading, setLoading] = useState(false); // edo incial de loading en false

  const [limit] = useState(10); //estado inicial de limit para limitar la cantidad de blogs que carga por solicitud, es un valor fijo por eso no se usa setLimit

  const [offset, setOffset] = useState(0); //estado inicial de offset para controlar desde qué blog empezamos a cargar

  const [loadMore, setLoadMore] = useState(true); // edo incial de loadMore para saber si hay más blogs que cargar

  const fetchBlogs = async () => {
    // Esta función es la que se encarga de cargar los blogs desde el backend
    if (loading || !loadMore) return; // Si ya estamos cargando o no hay más blogs para cargar, salimos de la función(early return).
    setLoading(true); // Si la función no se detiene en el return, llega a esta línea donde establece el estado como loading truem que indica q la app está comenzando a cargar datos

    try {
      const response = await axios.get("http://localhost:5000/blogs", {
        // Hacemos una solicitud GET a nuestro backend para obtener los blogs.
        params: { limit, offset }, // envio parámetros de consulta (query parameters) junto con la solicitud GET. Axios automáticamente convierte el objeto que le pasas en params en una cadena de consulta y lo añade a la URL de la solicitud
      }); // parámetros limit (cantidad) y offset (inicio) para la paginación.

      const newBlogs = response.data; // Guardamos los nuevos blogs obtenidos.La propiedad data en la variable response es donde Axios almacena los datos que recibe del servidor como respuesta a la solicitud HTTP

      setBlogs((prevBlogs) => [...prevBlogs, ...newBlogs]); // Función de actualización del estado de blogs que admite el valor actual como argumento, lo combino con una funcion de flecha y opoerador de propagacion para q se combinen o concatenen los valores del edo anterior con el nuevo
      //react pasa el valor actual del estado como argumento a la función de actualización automaticamente, la variable newBlogs es la que está definida para almacenar la respuesta y en el operador de propagación si quiero puedo invertir el orden
      setOffset((prevOffset) => prevOffset + limit); // Actualizo el offset para la próxima carga.

      setLoadMore(newBlogs.length > 0); // Verifico si aún hay más blogs para cargar.
    } catch (error) {
      // Si hay un error, lo mostramos en la consola.
      console.error("Error al cargar blogs", error);
    } finally {
      // Independientemente de si la solicitud fue exitosa o falló, dejamos de estar en estado de carga. Especifico en js para gestiónd e promesas, despues de funciones asincronas para indicar el fin de la opoeracion.
      setLoading(false);
    }
  };

  // Este useEffect se ejecuta una vez al montar el componente, para cargar los blogs inicialmente.
  useEffect(() => {
    //hook para realizar efectos secundarios en componentes funcionales cuando estos se rendericen
    fetchBlogs();
  }, []); // Dependencia vacía para que se ejecute solo una vez cuando el componente se monta.

  // Este useEffect se ejecuta cuando el usuario hace scroll hacia el final de la página.
  useEffect(() => {
    // Función que se ejecuta cada vez que el usuario hace scroll.
    const handleScroll = () => {
      // Si el usuario llegó al final de la página, cargamos más blogs.
      if (
        window.innerHeight + document.documentElement.scrollTop >= // altura visible de la ventana del navegador(por ejemplo 600px) +  cuántos píxeles ha hecho scroll (por ejemplo, si ha hecho 800px el faltarán 400px para el proximo borde inferiro del navegador)
        document.documentElement.offsetHeight //  posición actual del borde inferior de la ventana visible. El scrollrop inicia en 0 t va aumentando a medida que el usuario baja
      ) {
        fetchBlogs();
      }
    };

    // Agregamos el listener de scroll.
    window.addEventListener("scroll", handleScroll);
    // Limpiamos el listener de scroll cuando se desmonta el componente.
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, loadMore]); // Este efecto depende de que haya habido cambios en `loading` y `loadMore`.

  return (
    <div>
      <h1>Blogs</h1>
      {/* Recorremos la lista de blogs y mostramos cada uno */}
      {blogs.map((blog) => (
        <div key={blog.blog_id} className="blog-item">
          <h2>{blog.blog_title}</h2>
          <p>{blog.blog_content.slice(0, 1000)}...</p>
          {/* Mostramos un preview de 500 caracteres */}
          <Link to={`/blog/${blog.blog_id}`}>Read More</Link>
          {/* cada blog tiene un enlace que redirige a una ruta específica utilizando Link de React Router */}
        </div>
      ))}
      {/* Si estamos cargando más blogs, mostramos un spinner y un mnsje */}
      {loading && (
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default Blogs;

//***TODO****: agregar verificación del scroll para evitar pérdidas de memoria al cargar sin llegar al final de la página
//***TODO****: agregar verificación del scroll para evitar pérdidas de memoria al cargar sin llegar al final de la página
//***TODO****: agregar verificación del scroll para evitar pérdidas de memoria al cargar sin llegar al final de la página
