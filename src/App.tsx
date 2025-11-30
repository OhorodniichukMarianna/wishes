import { useEffect, useState, useRef } from "react";
import "./App.css";
import { useWishes } from "./hooks/useWishes";
import { Modal } from "./components/Modal";
import { ConfirmModal } from "./components/ConfirmModal";
import type { NewWish, SortBy, SortOrder, Wish } from "./types/wish";

function App() {
  const {
    wishes,
    loading,
    error,
    hasMore,
    currentPage,
    getWishes,
    createWish,
    updateWish,
    deleteWish,
  } = useWishes();
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [wishToDelete, setWishToDelete] = useState<string | null>(null);
  const [editingWish, setEditingWish] = useState<Wish | null>(null);
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);

  const [dateSort, setDateSort] = useState<"newest" | "oldest">("newest");
  const [priceSort, setPriceSort] = useState<"highToLow" | "lowToHigh">(
    "highToLow"
  );
  const [activeSortType, setActiveSortType] = useState<"date" | "price">(
    "date"
  );

  const sortParamsRef = useRef<{ sortBy: SortBy; sortOrder: SortOrder }>({
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [formData, setFormData] = useState<NewWish>({
    title: "",
    description: "",
    imageUrl: "",
    priority: "medium",
    price: 0,
    completed: false,
  });

  useEffect(() => {
    let sortBy: SortBy;
    let sortOrder: SortOrder;

    if (activeSortType === "date") {
      sortBy = "createdAt";
      sortOrder = dateSort === "newest" ? "desc" : "asc";
    } else {
      sortBy = "price";
      sortOrder = priceSort === "highToLow" ? "desc" : "asc";
    }

    sortParamsRef.current = { sortBy, sortOrder };

    getWishes(sortBy, sortOrder, 1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateSort, priceSort, activeSortType]);

  const handleLoadMore = async () => {
    const { sortBy, sortOrder } = sortParamsRef.current;
    await getWishes(sortBy, sortOrder, currentPage + 1, true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingWish) {
        await updateWish(editingWish.id, formData);
      } else {
        await createWish(formData);
      }

      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        priority: "medium",
        price: 0,
        completed: false,
      });
      setEditingWish(null);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save wish:", err);
    }
  };

  const handleEdit = (wish: Wish) => {
    setEditingWish(wish);
    setFormData({
      title: wish.title,
      description: wish.description,
      imageUrl: wish.imageUrl,
      priority: wish.priority,
      price: wish.price,
      completed: wish.completed,
    });
    setShowModal(true);
  };

  const handleDeleteClick = (id: string) => {
    setWishToDelete(id);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (wishToDelete) {
      try {
        await deleteWish(wishToDelete);
        setWishToDelete(null);
      } catch (err) {
        console.error("Failed to delete wish:", err);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingWish(null);
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      priority: "medium",
      price: 0,
      completed: false,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="mx-auto max-w-1400 px-4 w-full min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-4 sm:py-8 px-2 sm:px-4 flex justify-center">
      <div>
        <header className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">
            ✨ My Wishlist
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Keep track of your goals and dreams
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-md p-3 sm:p-6 mb-4 sm:mb-6 relative z-20">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
              <div className="flex-1 min-w-0">
                <label
                  htmlFor="dateSort"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                >
                  Sort by Date
                </label>
                <select
                  id="dateSort"
                  value={dateSort}
                  onChange={(e) => {
                    setDateSort(e.target.value as "newest" | "oldest");
                    setActiveSortType("date");
                  }}
                  className="w-full px-2 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              <div className="flex-1 min-w-0">
                <label
                  htmlFor="priceSort"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                >
                  Sort by Price
                </label>
                <select
                  id="priceSort"
                  value={priceSort}
                  onChange={(e) => {
                    setPriceSort(e.target.value as "highToLow" | "lowToHigh");
                    setActiveSortType("price");
                  }}
                  className="w-full px-2 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="highToLow">High to Low</option>
                  <option value="lowToHigh">Low to High</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Wish
            </button>
          </div>
        </div>

        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={editingWish ? "Update Wish" : "Create New Wish"}
        >
          <form onSubmit={handleSubmit}>
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
                onClick={handleCloseModal}
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

        <ConfirmModal
          isOpen={showConfirmDelete}
          onClose={() => {
            setShowConfirmDelete(false);
            setWishToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Wish"
          message="Are you sure you want to delete this wish? This action cannot be undone."
          confirmText="Yes, Delete"
          cancelText="No, Keep it"
        />

        {selectedWish && (
          <Modal
            isOpen={!!selectedWish}
            onClose={() => setSelectedWish(null)}
            title="Wish Details"
          >
            <div className="space-y-3 sm:space-y-4">
              <div>
                <img
                  src={selectedWish.imageUrl}
                  alt={selectedWish.title}
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
                  {selectedWish.title}
                </p>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">
                  Description
                </h3>
                <p className="text-sm sm:text-base text-gray-700">
                  {selectedWish.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">
                    Price
                  </h3>
                  <p className="text-lg sm:text-xl font-bold text-purple-600">
                    ${selectedWish.price.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">
                    Priority
                  </h3>
                  <span
                    className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full border ${getPriorityColor(
                      selectedWish.priority
                    )}`}
                  >
                    {selectedWish.priority.toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">
                  Status
                </h3>
                <p
                  className={`text-sm sm:text-base font-semibold ${
                    selectedWish.completed ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  {selectedWish.completed ? "✓ Completed" : "○ Pending"}
                </p>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">
                  Created At
                </h3>
                <p className="text-sm sm:text-base text-gray-700">
                  {new Date(selectedWish.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setSelectedWish(null)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-gray-900 font-bold py-2 sm:py-3 px-4 rounded-lg transition-all duration-200 text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </Modal>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error: {error}</p>
            <p className="text-sm mt-1">
              Make sure json-server is running on port 3001
            </p>
          </div>
        )}

        {loading && !wishes && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Loading wishes...</p>
          </div>
        )}

        {wishes && (
          <>
            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {wishes.length === 0 ? (
                <div className="col-span-full bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
                  <p className="text-gray-500 text-sm sm:text-lg">
                    No wishes yet. Start by adding your first wish!
                  </p>
                </div>
              ) : (
                wishes.map((wish: Wish) => (
                  <div
                    key={wish.id}
                    className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-xl ${
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

                    <div className="p-3 sm:p-4">
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
                        onClick={() => handleDeleteClick(wish.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-gray-900 font-bold py-1.5 sm:py-2 px-1 sm:px-2 rounded text-xs sm:text-sm transition-all duration-200 hover:shadow-md"
                        title="Delete"
                      >
                        <span className="hidden sm:inline">🗑️ Delete</span>
                        <span className="sm:hidden">🗑️</span>
                      </button>
                      <button
                        onClick={() => handleEdit(wish)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-gray-900 font-bold py-1.5 sm:py-2 px-1 sm:px-2 rounded text-xs sm:text-sm transition-all duration-200 hover:shadow-md"
                        title="Update"
                      >
                        <span className="hidden sm:inline">✏️ Update</span>
                        <span className="sm:hidden">✏️</span>
                      </button>
                      <button
                        onClick={() => setSelectedWish(wish)}
                        className="flex-1 bg-purple-500 hover:bg-purple-600 text-gray-900 font-bold py-1.5 sm:py-2 px-1 sm:px-2 rounded text-xs sm:text-sm transition-all duration-200 hover:shadow-md"
                        title="Details"
                      >
                        <span className="hidden sm:inline">📄 Details</span>
                        <span className="sm:hidden">📄</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {hasMore && wishes.length > 0 && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-gray-900 font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                      Load More
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
