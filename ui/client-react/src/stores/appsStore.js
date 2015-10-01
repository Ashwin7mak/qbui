
import Fluxxor from 'fluxxor';
import AppService from '../services/appService';
import Logger from '../utils/logger';

let AppsStore = Fluxxor.createStore({

    initialize: function() {
        this.apps = [];

        this.bindActions(
            'LOAD_APPS', this.onLoadApps,
            'LOAD_APPS_WITH_TABLES', this.onLoadAppsWithHydratedTables
        );

        this.logger = new Logger();
        this.appService = new AppService();
    },

    onLoadApps: function() {
        this.apps = [];
        this.appService.getApps().
            then(
            function(response) {
                this.logger.debug('success:' + response);
                this.apps = response.data;
                this.emit('change');
            }.bind(this),
            function(error) {
                this.logger.debug('error:' + error);
                this.emit('change');
            }.bind(this))
            .catch(
            function(ex) {
                this.logger.debug('exception:' + ex);
                this.emit('change');
            }.bind(this)
        );
    },

    onLoadAppsWithHydratedTables: function() {
        this.apps = [];
        this.appService.getApps().then(
            function(response) {
                this.logger.debug('success:' + response);
                response.data.forEach(function(app) {
                    this.appService.getApp(app.id).then(
                        function(a) {
                            this.apps.push(a.data);
                            this.emit('change');
                        }.bind(this)
                    );
                }.bind(this));
            }.bind(this),
            function(error) {
                this.logger.debug('error:' + error);
                //this.emit("change");
            }.bind(this))
            .catch(
            function(ex) {
                this.logger.debug('exception:' + ex);
                //this.emit("change");
            }.bind(this)
        );
    },

    getState: function() {
        return {
            apps: this.apps
        };
    },

});

export default AppsStore;