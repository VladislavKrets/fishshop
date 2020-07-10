import React from 'react';
import './App.css';
import {Route, Switch} from "react-router-dom";
import {BrowserRouter as Router} from 'react-router-dom'
import Main from "./Panels/Main/Main";
import Products from "./Panels/Products/Products";
import Contacts from "./Panels/Contacts/Contacts";
import Admin from "./Panels/Admin/Admin";
import Basket from "./Panels/Basket/Basket";
import CurrentProduct from "./Panels/CurrentProduct/CurrentProduct";
import ErrorPanel from "./Panels/ErrorPanel/ErrorPanel";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
        }
    }

    changeSelectedItems = (selectedItems) => {
        this.setState({
            selectedItems: selectedItems
        })
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/">
                        <Main
                            selectedItems={this.state.selectedItems}
                            changeSelectedItems={this.changeSelectedItems}
                        />
                    </Route>
                    <Route path="/products/">
                        <Products key={'products'} selectedItems={this.state.selectedItems}
                                  changeSelectedItems={this.changeSelectedItems}/>
                    </Route>
                    <Route exact path="/contacts/" component={Contacts}/>
                    <Route exact path="/basket/">
                        <Basket selectedItems={this.state.selectedItems}
                                changeSelectedItems={this.changeSelectedItems}/>
                    </Route>
                    <Route exact path="/manage/" component={Admin}/>
                    <Route path="*" component={ErrorPanel}/>
                </Switch>
            </Router>
        )
    }
}

export default App;
