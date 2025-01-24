'use client';

import { motion } from 'framer-motion';

export function WealthIcon() {
  return (
    <motion.svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Outer circle */}
      <motion.circle
        cx="20"
        cy="20"
        r="18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      {/* Inner compass details */}
      <motion.g
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity
        }}
      >
        {/* North */}
        <motion.path
          d="M20 4L23 16L20 13L17 16L20 4Z"
          fill="currentColor"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        />
        {/* South */}
        <motion.path
          d="M20 36L17 24L20 27L23 24L20 36Z"
          fill="currentColor"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 }}
        />
        {/* East */}
        <motion.path
          d="M36 20L24 23L27 20L24 17L36 20Z"
          fill="currentColor"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6 }}
        />
        {/* West */}
        <motion.path
          d="M4 20L16 17L13 20L16 23L4 20Z"
          fill="currentColor"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8 }}
        />
      </motion.g>

      {/* Center dot */}
      <motion.circle
        cx="20"
        cy="20"
        r="2"
        fill="currentColor"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      />

      {/* Cardinal points */}
      <motion.g
        style={{ opacity: 0.7 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1 }}
      >
        <text x="19" y="10" fill="currentColor" fontSize="4px" textAnchor="middle">N</text>
        <text x="19" y="32" fill="currentColor" fontSize="4px" textAnchor="middle">S</text>
        <text x="31" y="21" fill="currentColor" fontSize="4px" textAnchor="middle">E</text>
        <text x="7" y="21" fill="currentColor" fontSize="4px" textAnchor="middle">W</text>
      </motion.g>
    </motion.svg>
  );
}
