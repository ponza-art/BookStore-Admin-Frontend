// Example login function
export const login = async (email, password) => {
    try {
      const response = await fetch('https://book-store-backend-sigma-one.vercel.app/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      // Check if response is ok
      if (response.ok) {
        // Parse the response body as JSON
        const data = await response.json();
        
        console.log("Login Success:", data);
        // Use the data, e.g., store the token or navigate to another page
        return data;
      } else {
        console.error("Login failed with status:", response.status);
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };
  