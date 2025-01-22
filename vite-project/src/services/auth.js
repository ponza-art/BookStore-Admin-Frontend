export const login = async (email, password) => {
  try {
    const response = await fetch(
      "https://book-store-backend-azure-tau.vercel.app/users/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );
    if (response.ok) {
      const data = await response.json();
      // console.log("Login Success:", data);
      return data;
    } else {
      console.error("Login failed with status:", response.status);
    }
  } catch (error) {
    console.error("An error occurred during login:", error);
  }
};
