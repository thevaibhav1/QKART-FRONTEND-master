import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import theme from "./theme";
import { ThemeProvider } from "@mui/system";
import Checkout from "./components/Checkout"
import Thanks from "./components/Thanks"
// api/v1
export const config = {
  endpoint: `https://qkart-frontend-10.onrender.com/api/v1`,
};


function App() {
  return (
    <div className="App">
      {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
      <ThemeProvider theme={theme}>
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route exact path="/" component={Products} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/thanks" component={Thanks} />
        </Switch>
      </ThemeProvider>
    </div>
  );
}

export default App;
