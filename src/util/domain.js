let enva = process.env.NODE_ENV;
enva = "production"; // comment this by need
export default enva === "development"
  ? "http://localhost:5000"
  : enva === "production" && "https://pfplanner.herokuapp.com";
