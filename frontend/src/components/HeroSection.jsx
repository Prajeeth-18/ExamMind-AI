import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

function HeroSection() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center">

      <motion.h1
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-7xl font-extrabold text-white tracking-tight"
      >
        ExamMind AI
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-xl text-slate-300 max-w-3xl"
      >
        Revolutionizing handwritten answer sheet evaluation using
        Artificial Intelligence, OCR and Concept-Based Assessment.
      </motion.p>

      <motion.button
        whileHover={{
          scale: 1.05,
          boxShadow: "0px 0px 40px rgba(59,130,246,.8)"
        }}
        whileTap={{ scale: 0.95 }}
        className="mt-12 px-10 py-4 rounded-full
        bg-gradient-to-r from-blue-500 to-cyan-500
        text-white text-lg font-semibold
        flex items-center gap-3"
      >
        Get Started
        <ArrowRight size={22}/>
      </motion.button>

    </div>
  );
}

export default HeroSection;