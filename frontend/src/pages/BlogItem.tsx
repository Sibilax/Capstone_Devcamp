import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// Defino la interfaz para el objeto Blog, el tipo de objeto con sus campos y tipo de dato
interface Blog {
  blog_id: number;
  blog_title: string;
  blog_content: string;
  blog_img?: string; // Opcional
}

const BlogItem = () => {
  const { blog_id } = useParams(); //obtiene el id desde la url, esto va a hacer q coincida con el resultado de blogs y de la barra de bsuqueda
  // Especifica el tipo de estado blog como Blog o null
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/blog/${blog_id}`
        );
        setBlog(response.data); // Asigna los datos al estado blog
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blog_id]);

  if (loading) return <p>Loading...</p>;
  if (!blog) return <p>Blog not found.</p>;

  return (
    <div className="blog_item_result">
      {/* Usa blog.blog_title y blog.blog_content */}
      <h1>{blog.blog_title}</h1>
      <p>{blog.blog_content}</p>
      {blog.blog_img && (
        <img src={blog.blog_img} alt={`Image for ${blog.blog_title}`} />
      )}{" "}
      {/* Mostrar imagen si existe */}
    </div>
  );
};

export default BlogItem;
