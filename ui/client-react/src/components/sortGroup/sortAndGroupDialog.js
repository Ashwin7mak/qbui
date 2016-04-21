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


    /*
     props to receive report data which has the currentSortGroupInfo
     copied from loadedReport manipulated by dialog
     so we can know is its been customized for future saveAs report feature

     list of sort fields and ascend of descend  = array or fids, neg for descend, posit for ascend
     list of group fields 3 max  array of fids, neg for descend, posit for ascend, how options
     max num allowed to add

     actions
     actions to add a sort field / remove a sort field / toggle order of a sort field
     action to add a group field and how to group enum / remove a group field / toggle order of a group field
     action to apply the edited groups/sorts
     action to cancel the edits
     later? action to order the items in sort/grouplist

     states to maintain
     dialog hidden shown
     edited groups array - last field selected -
     edited sorts array

     queries for is field in list of sort fields2, in list of group fields

     */
    render() {
        //get groupFields from reportdata prop
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
                                 <div className="dialogContent">
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
                            <div className="dialogBand">
                                <div className="reset">Reset</div>
                            </div>
                            </div>
                        </div>
            </Popover>
        );
    }
});

export default SortAndGroupDialog;
