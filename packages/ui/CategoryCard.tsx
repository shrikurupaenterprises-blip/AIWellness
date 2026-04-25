import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  title: string;
  icon: ReactNode;
  onClick: () => void;
  color: string;
}

export function CategoryCard({ title, icon, onClick, color }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 cursor-pointer group hover:border-white/20 transition-all duration-300"
      style={{ boxShadow: `0 0 40px ${color}20` }}
    >
      <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110" style={{ color }}>
        {icon}
      </div>
      <h3 className="text-2xl font-semibold text-white">{title}</h3>
      <p className="text-white/50 mt-2">Explore frequencies</p>
    </motion.div>
  );
}