import { motion } from "framer-motion";

const Course: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      FCE
    </motion.div>
  );
};

export default Course;
