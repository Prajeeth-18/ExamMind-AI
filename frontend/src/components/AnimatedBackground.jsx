import { motion } from "framer-motion";

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10 bg-[#050816]">

      {/* Top Left Glow */}
      <motion.div
        animate={{
          x: [0, 80, 0],
          y: [0, 60, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
        }}
        className="absolute -top-40 -left-40 w-[450px] h-[450px]
        rounded-full bg-blue-500/30 blur-[150px]"
      />

      {/* Bottom Right Glow */}
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
        }}
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px]
        rounded-full bg-cyan-500/20 blur-[170px]"
      />

      {/* Purple Glow */}
      <motion.div
        animate={{
          y: [0, 80, 0],
          rotate: [0, 20, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
        }}
        className="absolute top-1/3 left-1/2
        -translate-x-1/2
        w-[350px]
        h-[350px]
        rounded-full
        bg-purple-500/20
        blur-[140px]"
      />

    </div>
  );
}

export default AnimatedBackground;