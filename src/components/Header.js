import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack} from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useSnackbar } from "notistack";


const Header = ({children,hasHiddenAuthButtons}) =>
  {
    const { enqueueSnackbar } = useSnackbar();
      
       const history = useHistory()    

       const backToExplore = () =>{
               history.push("/")
       }
    
       const logOut = () =>{
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      localStorage.removeItem("balance");
      enqueueSnackbar("Logged out",{ 
        variant: 'success',
        })
            history.push("/")
       window.location.reload();
    }

   const logOutButton = <Stack direction="row" spacing={1} alignItems="center" key="logout">
                     <Avatar src="avatar.png" alt="crio.do" />
                      {/* <img src="avatar.png" alt="User avatar"/> */}
                    <b>{localStorage.getItem("username")}</b>
                    <Button onClick={logOut}>LOGOUT</Button> 
                       </Stack>    
  
  const loginRegisterButtons =  <Stack direction="row" spacing={1} key="login">
                         <Link className="link" to="/login"><Button variant="text">LOGIN</Button></Link> 
                         <Link className="link" to="/register"><Button variant="contained">REGISTER</Button></Link>
                      </Stack>
  

  const backToExploreButton = <Box>
                       <Button
                        startIcon={<ArrowBackIcon />}
                        variant="text"
                        onClick ={backToExplore}>
                       BACK TO EXPLORE
                       </Button>
                     </Box> 
   
  

let buttonsCheck  = localStorage.getItem("username") ? [children,logOutButton] 
                                                  : [children,loginRegisterButtons]            
                
    return (
      <Box className="header">
        <Box
          className="header-title"
        >
          {/* FIXME - Skip svg in stub generator */}
          <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>         
    
        {hasHiddenAuthButtons? buttonsCheck
                                   : backToExploreButton }  
        </Box>
    );
  };

export default Header;
