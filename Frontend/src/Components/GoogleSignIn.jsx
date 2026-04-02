import { GoogleLogin } from "@react-oauth/google";
import axios from "../lib/axios.js";
import { useUserStore } from "../stores/useUserStore.js";
import { useNavigate } from "react-router-dom";

const GoogleSignIn = () => {
  const { setUser } = useUserStore();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;

      // send to backend
      const res = await axios.post("/api/auth/google", {
        token
      });

      // store user
      setUser(res.data);
      console.log(res.data);
      navigate('/');

    } catch (error) {
      console.log("Google login failed:", error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Login Failed")}
    />
  );
};

export default GoogleSignIn;