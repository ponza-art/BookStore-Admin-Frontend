// src/services/api.js
export const getBooks = async () => {
    const response = await fetch("https://book-store-backend-sigma-one.vercel.app/book/");
    return await response.json();
};

// Add a book to the backend
export const addBook = async (book, sourcePath, coverImage, samplePdf) => {
    const formData = new FormData();
    formData.append("title", book.title);
    formData.append("description", book.description);
    formData.append("price", book.price);
    formData.append("category", book.category);
    formData.append("authorName", book.author);
    formData.append("file", sourcePath);     // Book file
    formData.append("cover", coverImage);    // Cover Image file
    formData.append("sample", samplePdf);    // Sample PDF file

    try {
        const response = await fetch("https://book-store-backend-sigma-one.vercel.app/book/", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
        });
        return await response.json();
    } catch (error) {
        throw new Error("Failed to add the book: " + error.message);
    }
};

// Update an existing book
// Updated Frontend API Function
export const updateBook = async (id, updatedBook, coverImage, samplePdf, sourcePath) => {
    const formData = new FormData();
    formData.append("title", updatedBook.title);
    formData.append("description", updatedBook.description);
    formData.append("price", updatedBook.price);
    formData.append("category", updatedBook.category);
    formData.append("authorName", updatedBook.authorName); // Ensure authorName field is sent to backend
    
    // Optional file updates
    if (coverImage) formData.append("cover", coverImage);  // Attach cover image file if provided
    if (samplePdf) formData.append("sample", samplePdf);   // Attach sample PDF file if provided
    if (sourcePath) formData.append("file", sourcePath);   // Attach book file if provided

    try {
        const response = await fetch(`https://book-store-backend-sigma-one.vercel.app/book/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Add Authorization header
            },
            body: formData, // Send FormData object as request body
        });

        if (!response.ok) {
            // Backend returns an error response
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to update book");
        }

        return await response.json(); // Return the updated book data
    } catch (error) {
        throw new Error("Failed to update the book: " + error.message);
    }
};


// Delete a book from the backend
export const deleteBook = async (id) => {
    try {
        const response = await fetch(`https://book-store-backend-sigma-one.vercel.app/book/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete book");
        }

        return response.json();
    } catch (error) {
        throw new Error("Failed to delete the book: " + error.message);
    }
};


export const getBook = async (id) => {
    const response = await fetch(`https://book-store-backend-sigma-one.vercel.app/book/${id}`);
    return await response.json();
};

export const getUsers = async () => {
    const response = await fetch('https://book-store-backend-sigma-one.vercel.app/users', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return await response.json();
};

export const deleteUser = async (id) => {
    const response = await fetch(`https://book-store-backend-sigma-one.vercel.app/users/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to delete user');
    }
};

// Categories API
export const getCategories = async () => {
    const response = await fetch('https://book-store-backend-sigma-one.vercel.app/category');
    return await response.json();
};

export const addCategory = async (category) => {
    try {
        const response = await fetch('https://book-store-backend-sigma-one.vercel.app/category/create', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(category),
        });

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
        const response = await fetch(`https://book-store-backend-sigma-one.vercel.app/category/update/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCategory),
        });

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
    const response = await fetch(`https://book-store-backend-sigma-one.vercel.app/category/delete/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to delete category');
    }
};

// Orders API
export const getOrders = async () => {
    const response = await fetch('https://book-store-backend-sigma-one.vercel.app/order', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return await response.json();
};

export const createOrder = async (order) => {
    const response = await fetch('https://book-store-backend-sigma-one.vercel.app/order', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
    });
    return await response.json();
};

export const deleteOrder = async (id) => {
    const response = await fetch(`https://book-store-backend-sigma-one.vercel.app/order/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to delete order');
    }
};

//Authores APi

// Fetch all authors
export const getAuthors = async () => {
    try {
        const response = await fetch("https://book-store-backend-sigma-one.vercel.app/author", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching authors: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        return { error: "Failed to fetch authors" };
    }
};

// Add a new author (including file/image upload)
export const addAuthor = async (author) => {
    try {
        const response = await fetch("https://book-store-backend-sigma-one.vercel.app/author/create", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: author, // FormData object passed directly, which includes image and author details
        });

        if (!response.ok) {
            throw new Error(`Error adding author: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        return { error: "Failed to add author" };
    }
};

// Update author details (including updating the image)
export const updateAuthor = async (id, updatedAuthor) => {
    try {
        const response = await fetch(`https://book-store-backend-sigma-one.vercel.app/author/update/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: updatedAuthor, // FormData object passed directly
        });

        if (!response.ok) {
            throw new Error(`Error updating author: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        return { error: "Failed to update author" };
    }
};

// Delete an author
export const deleteAuthor = async (id) => {
    try {
        const response = await fetch(`https://book-store-backend-sigma-one.vercel.app/author/delete/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error deleting author: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        return { error: "Failed to delete author" };
    }
};
