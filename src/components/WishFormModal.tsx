import { Modal } from "./Modal";
import type { NewWish, Wish } from "../types/wish";

interface WishFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: NewWish;
  setFormData: React.Dispatch<React.SetStateAction<NewWish>>;
  editingWish: Wish | null;
  loading: boolean;
}

export const WishFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingWish,
  loading,
}: WishFormModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingWish ? "Update Wish" : "Create New Wish"}
    >
      <form onSubmit={onSubmit}>
        <div className="mb-3 sm:mb-4">
          <label
            htmlFor="imageUrl"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
          >
            Image URL *
          </label>
          <input
            type="url"
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
            required
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="mb-3 sm:mb-4">
          <label
            htmlFor="title"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter your wish title"
          />
        </div>

        <div className="mb-3 sm:mb-4">
          <label
            htmlFor="description"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
          >
            Description *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            rows={3}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Describe your wish"
          />
        </div>

        <div className="mb-3 sm:mb-4">
          <label
            htmlFor="price"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
          >
            Price ($) *
          </label>
          <input
            type="number"
            id="price"
            value={formData.price}
            onChange={(e) =>
              setFormData({
                ...formData,
                price: parseFloat(e.target.value) || 0,
              })
            }
            required
            min="0"
            step="0.01"
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <div className="mb-4 sm:mb-6">
          <label
            htmlFor="priority"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
          >
            Priority
          </label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) =>
              setFormData({
                ...formData,
                priority: e.target.value as "low" | "medium" | "high",
              })
            }
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="flex gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-400 hover:bg-gray-500 text-gray-900 font-bold py-2 sm:py-3 px-2 sm:px-4 rounded-lg transition-all duration-200 hover:shadow-md text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-gray-900 font-bold py-2 sm:py-3 px-2 sm:px-4 rounded-lg transition-all duration-200 disabled:opacity-50 hover:shadow-lg text-sm sm:text-base"
          >
            {loading
              ? editingWish
                ? "Updating..."
                : "Creating..."
              : editingWish
              ? "Update"
              : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

