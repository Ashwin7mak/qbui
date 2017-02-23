import ReactDOM from "react-dom";

import Fluxxor from "fluxxor";
import ReportDataStore from "../stores/reportDataStore";
import ReportDataSearchStore from "../stores/reportDataSearchStore";
import RecordPendingEditsStore from "../stores/recordPendingEditsStore";
import reportDataActions from "../actions/reportDataActions";
//import recordPendingEditsActions from "../actions/recordPendingEditsActions";
import FieldsStore from "../stores/fieldsStore";
import fieldsActions from "../actions/fieldsActions";
import AppsStore from "../stores/appsStore";
import appsActions from "../actions/appsActions";
import NavStore from "../stores/navStore";
import navActions from "../actions/navActions";
import FacetMenuStore from "../stores/facetMenuStore";
import facetMenuActions from "../actions/facetMenuActions";
import PerfStore from "../stores/perfStore";
import perfActions from "../actions/perfActions";
import recordActions from "../actions/recordActions";
import tableActions from '../actions/tableActions';

export default function getFlux() {
    let stores = {
        ReportDataStore: new ReportDataStore(),
        AppsStore: new AppsStore(),
        NavStore: new NavStore(),
        FacetMenuStore: new FacetMenuStore(),
        ReportDataSearchStore: new ReportDataSearchStore(),
        //RecordPendingEditsStore: new RecordPendingEditsStore(),
        FieldsStore: new FieldsStore(),
        PerfStore: new PerfStore()
    };
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(reportDataActions);
    //flux.addActions(recordPendingEditsActions);
    flux.addActions(appsActions);
    flux.addActions(navActions);
    flux.addActions(facetMenuActions);
    flux.addActions(fieldsActions);
    flux.addActions(tableActions);
    flux.addActions(perfActions);
    flux.addActions(recordActions);

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
