import React from 'react';
import './apps.css';
import sortByAll from 'lodash/collection/sortByAll.js';

var Content = React.createClass({

    render: function() {
        return (this.props.data.apps.length ?
                <ol className="apps">
                    {(sortByAll(this.props.data.apps, ['id'])).map((app) => {
                        let appName = app.name + ' (' + app.id + ')';
                        return (
                            <li className="app" key={appName}>
                                <div>{appName}</div>
                                <ul className="tables">
                                    {sortByAll(app.tables, ['name']).map((table) => {
                                        let tblName = table.name + ' (' + table.id + ')';
                                        let href = '/app/' + app.id + '/table/' + table.id;
                                        return (
                                            <li key={table.id}>
                                                <div><a href={href}>{tblName}</a></div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>
                        );
                    })}
                </ol> : <div></div>
        );
    }
});

export default Content;
