import ReactDOM from "react-dom";

import Fluxxor from "fluxxor";
import AppsStore from "../stores/appsStore";
import appsActions from "../actions/appsActions";
import PerfStore from "../stores/perfStore";
import perfActions from "../actions/perfActions";

export default function getFlux() {
    let stores = {
        AppsStore: new AppsStore(),
        PerfStore: new PerfStore()
    };
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(appsActions);
    flux.addActions(perfActions);

    //to ensure you don't get cascading dispatch errors with Fluxxor
    // if you dispatch actions from within componentWillMount or componentDidMount
    // this ties Fluxxor action dispatches to the React batched update
    flux.setDispatchInterceptor(function(action, dispatch) {
        ReactDOM.unstable_batchedUpdates(function() {
            dispatch(action);
        });
    });

    return flux;
}
