
import Register from "./components/Register";
import Logout from "./components/Logout";
import Login from "./components/Login";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


import Header from "./components/NavBar";
import NewPaste from "./components/NewPaste";
import LatestPastes from "./components/LatestPastes";
import ShowPaste from "./components/ShowPaste";
import EditPaste from "./components/EditPaste";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <div className="App">
        <Header></Header>
        <main>
          <Switch>
            <Route path="/" exact component={NewPaste}></Route>
            <Route path="/latest" component={LatestPastes}></Route>
            <Route path="/profile" component={Profile}></Route>
            <Route path="/paste/edit/:pasteId" component={EditPaste}></Route>
            <Route path="/paste/:idx" component={ShowPaste}></Route>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/logout" component={Logout} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
