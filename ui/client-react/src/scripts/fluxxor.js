import ReactDOM from "react-dom";

import Fluxxor from "fluxxor";
import ReportsStore from "../stores/reportsStore";
import reportActions from "../actions/reportActions";
import ReportDataStore from "../stores/reportDataStore";
import ReportDataSearchStore from "../stores/reportDataSearchStore";
import RecordPendingEditsStore from "../stores/recordPendingEditsStore";
import reportDataActions from "../actions/reportDataActions";
import recordPendingEditsActions from "../actions/recordPendingEditsActions";
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
import FormStore from '../stores/formStore';
import formActions from '../actions/formActions';

export default function getFlux() {
    let stores = {
        ReportsStore: new ReportsStore(),
        ReportDataStore: new ReportDataStore(),
        AppsStore: new AppsStore(),
        NavStore: new NavStore(),
        FacetMenuStore: new FacetMenuStore(),
        ReportDataSearchStore: new ReportDataSearchStore(),
        RecordPendingEditsStore: new RecordPendingEditsStore(),
        FieldsStore: new FieldsStore(),
        FormStore: new FormStore(),
        PerfStore: new PerfStore()
    };
    
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(reportActions);
    flux.addActions(reportDataActions);
    flux.addActions(recordPendingEditsActions);
    flux.addActions(appsActions);
    flux.addActions(navActions);
    flux.addActions(facetMenuActions);
    flux.addActions(fieldsActions);
    flux.addActions(formActions);
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
