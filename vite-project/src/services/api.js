// src/services/api.js
export const getBooks = async () => {
    const response = await fetch("https://book-store-backend-sigma-one.vercel.app/book");
    return await response.json();
  };
  
// src/services/api.js
export const addBook = async (book, file) => {
    const formData = new FormData();
    formData.append("title", book.title);
    formData.append("description", book.description);
    formData.append("file", file);
  
    const response = await fetch("https://book-store-backend-sigma-one.vercel.app/book", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });
  
    return await response.json();
  };
  
  export const updateBook = async (id, updatedBook, file) => {
    const formData = new FormData();
    formData.append("title", updatedBook.title);
    formData.append("description", updatedBook.description);
    if (file) formData.append("file", file);
  
    const response = await fetch(`https://book-store-backend-sigma-one.vercel.app/book/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error("Failed to update book");
    }
  
    return await response.json();
  };
  
// src/services/api.js
export const deleteBook = async (_id) => {
    console.log(_id);
    
    const token = localStorage.getItem("token");
    console.log("Token:", token); 
    
    const response = await fetch(`https://book-store-backend-sigma-one.vercel.app/book/${_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error("Failed to delete book");
    }
  
    return response.json();
  };
  

  export const getBook = async (id) => {
    const response = await fetch(`https://book-store-backend-sigma-one.vercel.app/book/${id}`);
    return await response.json();
  };
  
 // src/services/api.js
export const getUsers = async () => {
    const response = await fetch('https://book-store-backend-sigma-one.vercel.app/users/', {
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
  
  