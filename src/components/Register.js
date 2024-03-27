import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory } from "react-router-dom";
const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  


  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  // const handleChange = (event) => {
  //   username: event.username,
      

  // }
     const userData = {
     username : "",
     password : "",
     confirmPassword : ""
     };
    const [registeredData , setRegisteredData] = useState(userData);

   const handleData = (event) =>{
    const name = event.target.name;
    const value = event.target.value;
    setRegisteredData({...registeredData, [name] : value})
   }
  
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const register = async (formData) => {

    const collectFormData = { ...formData };
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${config.endpoint}/auth/register`,
        collectFormData
      );
      const data = res.data;
      setIsLoading(false);
      console.log(data);
      enqueueSnackbar("Registered Successfully", {
        variant: "success",
      });
      history.push("/login");
    } catch (e) {
      setIsLoading(false);
      if (e.response && e.response.status === 400) {
        return enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   * 
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  
  const validateInput = (data) => {
     let validData = { ...data };

     if (!validData.username) {
       enqueueSnackbar("Username is a required field", {
         variant: "warning",
       });
       return false;
     }

     if (validData.username.length < 6) {
       enqueueSnackbar("Username must be at least 6 characters", {
         variant: "warning",
       });
       return false;
     }

     if (!validData.password) {
       enqueueSnackbar("Password is a required field", {
         variant: "warning",
       });
       return false;
     }

     if (validData.password.length < 6) {
       enqueueSnackbar("Password must be at least 6 characters", {
         variant: "warning",
       });
       return false;
     }

     if (validData.password !== validData.confirmPassword) {
       enqueueSnackbar("Passwords do not match", {
         variant: "warning",
       });
       return false;
     }
     delete validData.confirmPassword;
     return register(validData);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons={false} />
      <Box className="content">
        <Stack spacing={1} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            value={registeredData.username}
            onChange={handleData}
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            value={registeredData.password}
            onChange={handleData}
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            value={registeredData.confirmPassword}
            onChange={handleData}
            type="password"
            fullWidth
          />
          {isLoading ? <Box display="flex" justifyContent="center">
            <CircularProgress color="success" />
          </Box> : <Button className="button" variant="contained" onClick={() => validateInput(registeredData)} >
            Register Now
          </Button>}
          <p className="secondary-action">
            Already have an account?{" "}
            <a className="link" href="/login">
              Login here
            </a>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
