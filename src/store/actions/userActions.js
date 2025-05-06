import axios from "axios";
import { setUser } from "../userSlice";

const fetchUserDetails = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // e.g., "HR" or "EXECUTIVE"

  let url = "";

  if (role === "HR") {
    url = "http://localhost:8081/api/hr/username";
  } else if (role === "EXECUTIVE") {
    url = "http://localhost:8081/api/executive/username";
  }

  if (!url) return console.error("Invalid role or endpoint not defined");

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(setUser({ user: response.data }));
  } catch (err) {
    console.error("Failed to fetch user details", err);
  }
};

export default fetchUserDetails;
