import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import {Button} from 'react-bootstrap';
import Logger from '../../utils/logger';
import Locale from '../../locales/locales';
import StringUtils from '../../utils/stringUtils';
import {Popover} from 'react-bootstrap';
import OverlayDialogHeader from '../overLay/overlayDialogHeader';
import FieldSettings from './fieldSettings';
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
        let groupByFields = [//{name:'Project', decendOrder:true},
                           // {name:'Date', decendOrder:false}
        ];
        let sortByFields = [{name:'Claire', decendOrder:true},
                           //{name:'A longer klhlhklh lkh klh field ', decendOrder:false},
                           //{name:'A longer klhlhklh lkh klh field ', decendOrder:false},
                           {name:'A longer klhlhklh lkh klh field ', decendOrder:false},
                           //{name:'A longer klhlhklh lkh klh field ', decendOrder:false},
                           //{name:'A longer klhlhklh lkh klh field ', decendOrder:false},
                           //{name:'A longer klhlhklh lkh klh field ', decendOrder:false},
                            {name:'Company'},  {name:'Company'}
        ];
        return (
            <Popover container={this} id="sortAndGroupDialog"
                     className="sortAndGroupDialog"
                     placement="bottom">
                    <div>
                        <FieldsPanel onHideFields={this.props.onHideFields}
                                     showFields={this.props.showFields}
                                     fieldsForType={this.props.fieldsForType}/>
                        <div className={"settingsDialog" + (this.props.showFields ? ' fieldsShown' : '')} >
                            <div className="dialogTop">
                                <OverlayDialogHeader
                                    iconName="sortButton"
                                    icon="sort-az"
                                    dialogTitleI18N="report.sortAndGroup.header"
                                    onCancel={this.props.onClose}
                                />
                            </div>
                             <div className="dialogContent">
                                 <FieldSettings maxLength={3}
                                                  type="group" fields={groupByFields}
                                                  onShowFields={this.props.onShowFields}
                                                  onHideFields={this.props.onHideFields}
                                 />
                                 <FieldSettings  maxLength={5}
                                                  type="sort" fields={sortByFields}
                                                  onShowFields={this.props.onShowFields}
                                                  onHideFields={this.props.onHideFields}
                                 />
                             </div>
                            <div className="dialogBottom">
                                <div className="dialogButtons">
                                     <span className="reset" tabIndex="0">
                                        <I18nMessage message="report.sortAndGroup.reset"/>
                                     </span>
                                     <Button className="apply" bsStyle="primary">
                                         <I18nMessage message="apply"/>
                                     </Button>
                                 </div>
                                <div className="dialogBand">
                                    <div className="reset" tabIndex="0">
                                        <I18nMessage message="report.sortAndGroup.reset"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </Popover>
        );
    }
});

export default SortAndGroupDialog;
