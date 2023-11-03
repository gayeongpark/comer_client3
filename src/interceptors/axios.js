import axios from "axios";
import { useNavigate } from "react-router-dom";
//Interceptors are functions that can be used to modify requests or responses before they are sent or received.
//In this case, interceptors are being used to automatically refresh the user's access token when it has expired.
//By using an interceptor, the process of refreshing the access token can be handled automatically without the need for the user to manually log in again, providing a better user experience.

const jwtInterceptor = axios.create({});

// Define a function to intercept responses from Axios requests.
jwtInterceptor.interceptors.response.use(
  (response) => {
    return response;
  }, // If the response is successful, just return it without modifications.
  async (error) => {
    let refresh = false; // Initialize a variable to keep track of whether a token refresh is in progress.
    const navigate = useNavigate(); // Get the navigation function from react-router-dom.

    // Check if the error corresponds to a 401 Unauthorized status code and token refresh is not in progress.
    if (error?.response?.status === 401 && !refresh) {
      try {
        refresh = true; // Set the refresh flag to true to prevent multiple simultaneous refresh attempts.

        // Send a POST request to "/auth/refreshtoken" to refresh the access token.
        const response = await axios.post("/auth/refreshtoken", {
          headers: { "content-Type": "application/json" },
          withCredentials: true, // Include credentials (e.g., cookies) with the request.
        });

        // If the token refresh is successful (status code 200), reattempt the original request.
        if (response.status === 200) {
          return axios(error.config);
          // This is a key part of the code that handles token refresh in the Axios interceptor
          // It is used to retry the original HTTP request after a successful token refresh.
          // error.config does contain enough information to recreate the original request.
          // It is a critical part of the code that allows the original request to be retried with a fresh access token after the token refresh, maintaining a smooth user experience.
          // To retry the original request, you need the request configuration, which includes the original URL, method, headers, and any request data.
          // Retrying the original request is a user-centric approach to handling expired tokens.
          // It ensures that the user's actions are not interrupted by the need to refresh tokens or perform additional login steps.
          // Instead, the application handles token refresh and seamlessly continues with the user's intended operation.
        }
      } catch (error) {
        // Handle errors that may occur during the token refresh.
        console.error("Error refreshing token:", error);

        // Redirect the user to the login page.
        navigate("/login");

        // Re-throw the error to propagate it to the original request.
        throw error;
      }
    } else {
      // Handle other error responses (e.g., network errors or non-401 errors).
      refresh = false; // Reset the refresh flag.
      console.error("Error:", error);

      // Redirect the user to the login page.
      navigate("/login");

      // Re-throw the error to propagate it to the original request.
      throw error;
    }
  }
);

export default jwtInterceptor
