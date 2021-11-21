import axios from "axios";

export default axios.create({
  baseURL: "https://api.daily.co/v1",
  headers: {
    Authorization: `Bearer 039a83b8603f1cb4e3e251191767c1f503ea28e7e884d8ca743ff1a2952ebcfa`,
  },
});
