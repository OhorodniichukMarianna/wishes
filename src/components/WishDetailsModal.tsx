import { Modal } from "./Modal";
import type { Wish } from "../types/wish";

interface WishDetailsModalProps {
  wish: Wish | null;
  onClose: () => void;
  getPriorityColor: (priority: string) => string;
}

export const WishDetailsModal = ({
  wish,
  onClose,
  getPriorityColor,
}: WishDetailsModalProps) => {
  if (!wish) return null;

  return (
    <Modal isOpen={!!wish} onClose={onClose} title="Wish Details">
      <div className="space-y-3 sm:space-y-4">
        <div>
          <img
            src={wish.imageUrl}
            alt={wish.title}
            className="w-full h-48 sm:h-64 object-cover rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop";
            }}
          />
        </div>

        <div>
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">
            Title
          </h3>
          <p className="text-base sm:text-lg font-semibold text-gray-800">
            {wish.title}
          </p>
        </div>

        <div>
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">
            Description
          </h3>
          <p className="text-sm sm:text-base text-gray-700">
            {wish.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">
              Price
            </h3>
            <p className="text-lg sm:text-xl font-bold text-purple-600">
              ${wish.price.toFixed(2)}
            </p>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">
              Priority
            </h3>
            <span
              className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full border ${getPriorityColor(
                wish.priority
              )}`}
            >
              {wish.priority.toUpperCase()}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">
            Status
          </h3>
          <p
            className={`text-sm sm:text-base font-semibold ${
              wish.completed ? "text-green-600" : "text-gray-600"
            }`}
          >
            {wish.completed ? "✓ Completed" : "○ Pending"}
          </p>
        </div>

        <div>
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">
            Created At
          </h3>
          <p className="text-sm sm:text-base text-gray-700">
            {new Date(wish.createdAt).toLocaleString()}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 sm:py-3 px-4 rounded-lg transition-all duration-200 text-sm sm:text-base"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

