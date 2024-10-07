import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

interface Video {
  video_id: number;
  video_title: string;
  video_url: string;
  video_content: string;
}

const Videos: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchVideos = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:5000/videos", {
        params: { limit, offset },
      });

      const newVideos = response.data;

      setVideos((prevVideos) => [...prevVideos, ...newVideos]);
      setOffset((prevOffset) => prevOffset + limit);
      setHasMore(newVideos.length > 0);
    } catch (error: any) {
      //si me olvido del tipo me indicará que es type unknown
      console.error(
        "Error al cargar videos",
        error.response?.data || error.message
      );
      setError("Error al cargar videos. Intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight
      ) {
        fetchVideos();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <div>
      <h1>Videos</h1>
      {error && <p className="error-message">{error}</p>}

      {videos.map((video) => (
        <div key={video.video_id} className="video-item">
          <h2>{video.video_title}</h2>
          <p>{video.video_content.slice(0, 500)}...</p>

          <Link to={`/video/${video.video_id}`}>Read More</Link>
          <a href={video.video_url} target="_blank" rel="noopener noreferrer">
            Watch Video
          </a>
        </div>
      ))}
      {loading && (
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default Videos;

//***TODO: manjeo de scroll para optimizar memoria
//***TODO: cambiar console.log a sentry
