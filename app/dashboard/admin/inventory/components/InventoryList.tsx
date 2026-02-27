'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { InventoryCard } from './InventoryCard'

const SkeletonCard = () => (
  <div className="w-full bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm overflow-hidden">
    <div className="flex justify-between items-start mb-6">
      <div className="h-8 w-32 skeleton-shimmer rounded-lg" />
      <div className="h-8 w-8 skeleton-shimmer rounded-full" />
    </div>
    <div className="grid grid-cols-2 gap-3 mb-6">
      <div className="h-16 skeleton-shimmer rounded-2xl" />
      <div className="h-16 skeleton-shimmer rounded-2xl" />
    </div>
    <div className="space-y-3">
      <div className="h-20 skeleton-shimmer rounded-2xl w-full" />
      <div className="h-20 skeleton-shimmer rounded-2xl w-full" />
    </div>
  </div>
);

export function InventoryList({ products, onRefresh, onDelete, isLoading }: any) {
  // Sorting is done here once to keep the render clean
  const sortedProducts = [...products].sort((a, b) => 
    (a.name || "").toString().localeCompare((b.name || "").toString())
  );

  return (
    <div className="w-full">
      {/* GRID BREAKPOINTS DEFINITION:
        - lg (Laptop): grid-cols-3
        - xl (Lg Laptop): grid-cols-4
        - 3xl (Monitor): grid-cols-5
        - 4xl (Ultrawide): grid-cols-6
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6 gap-6 lg:gap-8 pb-20">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            // Render skeletons during initial fetch
            Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SkeletonCard />
              </motion.div>
            ))
          ) : (
            // Render actual product cards
            sortedProducts.map((product: any) => (
              <motion.div 
                key={product.id} 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="w-full flex justify-center" // Center card in grid cell
              >
                <InventoryCard 
                  product={product} 
                  onRefresh={onRefresh} 
                  onDelete={onDelete} 
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}