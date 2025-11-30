import type { Wish } from "../types/wish";

interface WishCardProps {
  wish: Wish;
  onDelete: (id: string) => void;
  onEdit: (wish: Wish) => void;
  onViewDetails: (wish: Wish) => void;
  getPriorityColor: (priority: string) => string;
}

export const WishCard = ({
  wish,
  onDelete,
  onEdit,
  onViewDetails,
  getPriorityColor,
}: WishCardProps) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-xl flex flex-col ${
        wish.completed ? "opacity-75" : ""
      }`}
    >
      <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-200">
        <img
          src={wish.imageUrl}
          alt={wish.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop";
          }}
        />
        <span
          className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full border ${getPriorityColor(
            wish.priority
          )}`}
        >
          {wish.priority.toUpperCase()}
        </span>
      </div>

      <div className="p-3 sm:p-4 flex-grow">
        <h3
          className={`text-base sm:text-xl font-bold mb-1 sm:mb-2 line-clamp-2 ${
            wish.completed
              ? "line-through text-gray-500"
              : "text-gray-800"
          }`}
        >
          {wish.title}
        </h3>
        <p
          className={`text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2 ${
            wish.completed ? "line-through" : ""
          }`}
        >
          {wish.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg sm:text-xl font-bold text-purple-600">
            ${wish.price.toFixed(2)}
          </span>
          <span className="text-[10px] sm:text-xs text-gray-400">
            {new Date(wish.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="px-2 sm:px-3 py-2 sm:py-3 bg-gray-50 border-t border-gray-200 flex gap-1 sm:gap-2">
        <button
          onClick={() => onDelete(wish.id)}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-1.5 sm:py-2 px-1 sm:px-2 rounded text-lg transition-all duration-200 hover:shadow-md"
          title="Delete"
          aria-label="Delete wish"
        >
          🗑️
        </button>
        <button
          onClick={() => onEdit(wish)}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 sm:py-2 px-1 sm:px-2 rounded text-lg transition-all duration-200 hover:shadow-md"
          title="Update"
          aria-label="Update wish"
        >
          ✏️
        </button>
        <button
          onClick={() => onViewDetails(wish)}
          className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-1.5 sm:py-2 px-1 sm:px-2 rounded text-lg transition-all duration-200 hover:shadow-md"
          title="Details"
          aria-label="View wish details"
        >
          📄
        </button>
      </div>
    </div>
  );
};

