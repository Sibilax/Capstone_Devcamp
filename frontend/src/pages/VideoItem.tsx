import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// Define la interfaz para el objeto Video
interface Video {
  video_id: number;
  video_title: string;
  video_content?: string;
  video_url: string; // Opcional
}

const VideoItem = () => {
  const { video_id } = useParams();
  const [video, setVideo] = useState<Video | null>(null); //el estado puede ser video o null, comienza en null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/video/${video_id}`
        );
        setVideo(response.data); // Asigna los datos al estado video
      } catch (error) {
        console.error("Error fetching video:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [video_id]);

  if (loading) return <p>Loading...</p>;
  if (!video) return <p>Video not found.</p>;

  return (
    <div>
      {/* Usa video.video_title y video.video_content */}
      <h1>{video.video_title}</h1>
      <p>{video.video_content}</p>
    </div>
  );
};

export default VideoItem;

//TODO: matchear los divs para los estilos con los de blogitem
