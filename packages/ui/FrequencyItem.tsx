import { motion } from 'framer-motion';

interface FrequencyItemProps {
  title: string;
  duration: string;
  isPlaying?: boolean;
  onPlay: () => void;
}

export function FrequencyItem({ title, duration, isPlaying = false, onPlay }: FrequencyItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between group hover:border-white/20 transition-all duration-300"
    >
      <div className="flex-1">
        <h4 className="text-lg font-medium text-white group-hover:text-purple-400 transition-colors">{title}</h4>
        <p className="text-sm text-white/50">{duration}</p>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onPlay}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
          isPlaying 
            ? 'bg-purple-600 text-white' 
            : 'bg-white/10 text-white/70 hover:bg-white/20'
        }`}
      >
        {isPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </motion.button>
    </motion.div>
  );
}