import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import {Button} from 'react-bootstrap';
import Logger from '../../utils/logger';
import Locale from '../../locales/locales';
import StringUtils from '../../utils/stringUtils';
import {Popover} from 'react-bootstrap';
import OverlayDialogHeader from '../overLay/overlayDialogHeader';
import SortBySettings from './sortBySettings';
import GroupBySettings from './groupBySettings';
import FieldsPanel from './fieldsPanel';


import './sortAndGroup.scss';

let logger = new Logger();

var SortAndGroupDialog = React.createClass({

    propTypes: {
        onClose  : React.PropTypes.func
    },

    render() {

        let groupByFields = [//{name:'Project'},
                            {name:'Date', decendOrder:true}
        ];
        let sortByFields = [//{name:'Claire', decendOrder:true},
                           // {name:'A longer klhlhklh lkh klh field ', decendOrder:false},
                           // {name:'Company'},  {name:'Company'}
        ];
        return (
            <Popover container={this} id="sortAndGroupDialog"
                     className="sortAndGroupDialog"
                     placement="bottom">
                    <div>
                        <FieldsPanel />
                        <div className="settingsDialog">
                            <div className="topDialog">
                                <OverlayDialogHeader
                                    iconName="sortButton"
                                    icon="sort-az"
                                    dialogTitleI18N="report.sortAndGroup.header"
                                    onCancel={this.props.onClose}
                                />
                                 <div>
                                     <GroupBySettings maxLength={3}
                                                      type="group" fields={groupByFields}/>
                                     <SortBySettings  maxLength={5}
                                                      type="sort" fields={sortByFields}/>
                                 </div>
                            </div>
                             <div className="dialogButtons">
                                 <span className="reset">Reset</span>
                                 <Button className="apply" bsStyle="primary">Apply</Button>
                             </div>
                            </div>
                        </div>
            </Popover>
        );
    }
});

export default SortAndGroupDialog;
