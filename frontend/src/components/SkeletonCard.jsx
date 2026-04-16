const SkeletonCard = () => (
  <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 animate-pulse">
    <div className="aspect-square bg-gray-200" />
    <div className="p-6 space-y-3">
      <div className="h-3 bg-gray-200 rounded-full w-1/3" />
      <div className="h-5 bg-gray-200 rounded-full w-4/5" />
      <div className="h-4 bg-gray-200 rounded-full w-1/2" />
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="h-7 bg-gray-200 rounded-full w-1/4" />
        <div className="h-10 bg-gray-200 rounded-2xl w-24" />
      </div>
    </div>
  </div>
);

export default SkeletonCard;
