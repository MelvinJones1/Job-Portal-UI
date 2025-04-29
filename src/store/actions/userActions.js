import axios from "axios";
import { setUser } from "../userSlice";

const fetchUserDetails = () => async (dispatch) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`http://localhost:8081/api/hr/username`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  dispatch(setUser({ user: response.data }));
};

export default fetchUserDetails;
