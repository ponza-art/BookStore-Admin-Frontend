export const getBooks = async (queryParams = {}) => {
  const query = new URLSearchParams(queryParams).toString();
  const response = await fetch(
    `https://book-store-backend-azure-tau.vercel.app/book/?${query}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return await response.json();
};

export const addBook = async (book, sourcePath, coverImage, samplePdf) => {
  const formData = new FormData();
  formData.append("title", book.title);
  formData.append("description", book.description);
  formData.append("price", book.price);
  formData.append("category", book.category);
  formData.append("authorName", book.author);
  formData.append("discountPercentage", book.discountPercentage);
  formData.append("file", sourcePath);
  formData.append("cover", coverImage);
  formData.append("sample", samplePdf);

  try {
    const response = await fetch(
      "https://book-store-backend-azure-tau.vercel.app/book/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }
    );
    return await response.json();
  } catch (error) {
    throw new Error("Failed to add the book: " + error.message);
  }
};

export const updateBook = async (
  id,
  updatedBook,
  coverImage,
  samplePdf,
  sourcePath
) => {
  const formData = new FormData();
  formData.append("title", updatedBook.title);
  formData.append("description", updatedBook.description);
  formData.append("price", updatedBook.price);
  formData.append("category", updatedBook.category);
  formData.append("authorName", updatedBook.authorName);
  formData.append("discountPercentage", updatedBook.discountPercentage);

  if (coverImage) formData.append("cover", coverImage);
  if (samplePdf) formData.append("sample", samplePdf);
  if (sourcePath) formData.append("file", sourcePath);

  try {
    const response = await fetch(
      `https://book-store-backend-azure-tau.vercel.app/book/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update book");
    }

    return await response.json();
  } catch (error) {
    throw new Error("Failed to update the book: " + error.message);
  }
};

export const deleteBook = async (id) => {
  try {
    const response = await fetch(
      `https://book-store-backend-azure-tau.vercel.app/book/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete book");
    }

    return response.json();
  } catch (error) {
    throw new Error("Failed to delete the book: " + error.message);
  }
};

export const getBook = async (id) => {
  const response = await fetch(
    `https://book-store-backend-azure-tau.vercel.app/book/${id}`
  );
  return await response.json();
};

export const getUsers = async () => {
  const response = await fetch(
    "https://book-store-backend-azure-tau.vercel.app/users",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return await response.json();
};

export const deleteUser = async (id) => {
  const response = await fetch(
    `https://book-store-backend-azure-tau.vercel.app/users/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
};

export const userStatus = async (id, newStatus) => {
  const response = await fetch(
    "https://book-store-backend-azure-tau.vercel.app/users/edit-status",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ userId: id, status: newStatus }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update user status");
  }
};

export const getCategories = async () => {
  const response = await fetch(
    "https://book-store-backend-azure-tau.vercel.app/category"
  );
  return await response.json();
};

export const addCategory = async (category) => {
  try {
    const response = await fetch(
      "https://book-store-backend-azure-tau.vercel.app/category/create",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add category");
    }

    return await response.json();
  } catch (error) {
    console.error("Add Category Error: ", error);
    throw error;
  }
};

export const updateCategory = async (id, updatedCategory) => {
  try {
    const response = await fetch(
      `https://book-store-backend-azure-tau.vercel.app/category/update/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCategory),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update category");
    }

    return await response.json();
  } catch (error) {
    console.error("Update Category Error: ", error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  const response = await fetch(
    `https://book-store-backend-azure-tau.vercel.app/category/delete/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete category");
  }
};

export const getOrders = async () => {
  const response = await fetch(
    "https://book-store-backend-azure-tau.vercel.app/order",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return await response.json();
};

export const createOrder = async (order) => {
  const response = await fetch(
    "https://book-store-backend-azure-tau.vercel.app/order",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    }
  );
  return await response.json();
};

export const deleteOrder = async (id) => {
  const response = await fetch(
    `https://book-store-backend-azure-tau.vercel.app/order/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete order");
  }
};

export const getAuthors = async () => {
  try {
    const response = await fetch(
      "https://book-store-backend-azure-tau.vercel.app/author",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching authors: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch authors" };
  }
};

export const getorders = async () => {
  try {
    const response = await fetch(
      "https://book-store-backend-azure-tau.vercel.app/orders/all",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching authors: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch authors" };
  }
};

export const addAuthor = async (author) => {
  try {
    const response = await fetch(
      "https://book-store-backend-azure-tau.vercel.app/author/create",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: author,
      }
    );

    if (!response.ok) {
      throw new Error(`Error adding author: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return { error: "Failed to add author" };
  }
};

export const updateAuthor = async (id, updatedAuthor) => {
  try {
    const response = await fetch(
      `https://book-store-backend-azure-tau.vercel.app/author/update/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: updatedAuthor,
      }
    );

    if (!response.ok) {
      throw new Error(`Error updating author: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return { error: "Failed to update author" };
  }
};

export const deleteAuthor = async (id) => {
  try {
    const response = await fetch(
      `https://book-store-backend-azure-tau.vercel.app/author/delete/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error deleting author: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete author" };
  }
};

export const getAllReviews = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    "https://book-store-backend-azure-tau.vercel.app/review/all-reviews",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return response.json();
};

export const deleteReview = async (reviewId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `https://book-store-backend-azure-tau.vercel.app/review/admin/${reviewId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete review");
  }

  return response.json();
};


export const getStats = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("https://book-store-backend-azure-tau.vercel.app/admin/stats", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch statistics");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
};
