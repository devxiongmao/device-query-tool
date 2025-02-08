import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import HomePage from './HomePage';
import NavigationBar from './NavigationBar';
import NotFound from './NotFound';
import Create from './Create';
import CreateSoftware from './CreateSoftware';
import CreateFeature from './CreateFeature';
import EditSoftware from './EditSoftware';
import DeviceDetails from './DeviceDetails';


function App() {
  return (
    <Router>
    <div className="App">
      <NavigationBar />
      <div className="content">
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/new">
            <Create />
          </Route>
          <Route path="/devices/:id/softwares/:sid/edit">
            <EditSoftware />
          </Route>
          <Route path="/devices/:id/softwares/new">
            <CreateSoftware />
          </Route>
          <Route path="/devices/:id">
            <DeviceDetails />
          </Route>
          <Route path="/features/new">
            <CreateFeature />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </div>
    </div>
  </Router>
  );
}

export default App;
