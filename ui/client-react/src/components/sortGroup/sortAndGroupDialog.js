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

import thwartClicksWrapper from '../hoc/thwartClicksWrapper';
import closeOnEscape from '../hoc/catchEscapeKey';

import './sortAndGroup.scss';
import '../../assets/css/animate.min.css';
let logger = new Logger();

var SortAndGroupDialog = React.createClass({

    propTypes: {
        onClose  : React.PropTypes.func,
        handleClickOutside : React.PropTypes.func,
    },

    renderFieldSettings(maxLength, type, fields) {
        return (
              <FieldSettings  maxLength={maxLength}
                              type={type} fields={fields}
                              onShowFields={this.props.onShowFields}
                              onHideFields={this.props.onHideFields}
                              onRemoveField={this.props.onRemoveField}
                              onSetOrder={this.props.onSetOrder}
                              fieldChoiceList={this.props.fieldChoiceList}
              />
          );
    },

    handleClickOutside(evt) {
        if (this.props.handleClickOutside(evt)) {
            this.props.handleClickOutside(evt);
        }
    },

    /*
     props to receive report data which has the currentSortGroupInfo
     copied from loadedReport manipulated by dialog
     so we can know if its been customized for future saveAs report feature

     list of sort fields 5 max and ascend of descend  = array or fids, neg for descend, positive for ascend
     list of group fields 3 max array of fids, neg for descend, posit for ascend, how options
     max num allowed to add

     actions
     actions to add a sort field / remove a sort field / toggle order of a sort field
     action to add a group field  / remove a group field / toggle order of a group field
     action to apply the edited groups/sorts
     action to cancel the edits
     later story action to order the items in sort/grouplist dnd

     states to maintain
     dialog hidden shown
     edited groups array - last field selected -
     edited sorts array

     queries for is field in list of sort fields2, in list of group fields

     */
    render() {
        // wrap the sort dialog in additional functionality to close the dialog on escape
        // and to not handle any outside clicks while the dialog is open
        const SortAndGroupPopover = React.createClass({
            render() {
                return <Popover
                    {...this.props}
                    {...this.state}
                />;
            }
        });
        let SortAndGroupDialogWrapped = thwartClicksWrapper(closeOnEscape(SortAndGroupPopover));

        return (
            this.props.show ? (
            <SortAndGroupDialogWrapped container={this} id="sortAndGroupDialog"
                     className="sortAndGroupDialog"
                     outsideClickIgnoreClass="sortAndGroupContainer"
                     handleClickOutside={this.handleClickOutside}
                     onClose={this.props.onClose}
                     placement="bottom">
                    <div>
                        <div className={"settingsDialog" + (this.props.showFields ? ' fieldsShown' : '')} >
                            <div className="dialogTop">
                                <OverlayDialogHeader
                                    iconName="sortButton"
                                    icon="sort-az"
                                    dialogTitleI18N="report.sortAndGroup.header"
                                    onCancel={this.props.onClose}
                                    onApplyChanges={this.props.onApplyChanges}
                                    onReset={this.props.onReset}
                                />
                            </div>
                             <div className="dialogContent">
                                 {this.renderFieldSettings(3, "group", this.props.groupByFields)}
                                 {this.renderFieldSettings(5, "sort", this.props.sortByFields)}
                             </div>
                            <div className="dialogBottom">
                                <div className="dialogButtons">
                                     <span className="reset" tabIndex="0" onClick={this.props.onReset}>
                                        <I18nMessage message="report.sortAndGroup.reset"/>
                                     </span>
                                     <Button className={"apply " + this.props.dirty}  bsStyle="primary"
                                             onClick={this.props.onApplyChanges}>
                                         <I18nMessage message="apply"/>
                                     </Button>
                                 </div>
                                <div className="dialogBand">
                                    <div className="reset" tabIndex="0" onClick={this.props.onReset}>
                                        <I18nMessage message="report.sortAndGroup.reset"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <FieldsPanel onHideFields={this.props.onHideFields}
                                     showFields={this.props.showFields}
                                     fields={this.props.fields}
                                     fieldChoiceList={this.props.fieldChoiceList}
                                     reportColumns={this.props.reportData && this.props.reportData.data ?
                                        this.props.reportData.data.columns :  null}
                                     fieldsLoading={this.props.fieldsLoading}
                                     sortByFields={this.props.sortByFields}
                                     groupByFields={this.props.groupByFields}
                                     onSelectField={this.props.onSelectField}
                                     showMoreFields={this.props.showMoreFields}
                                     showNotVisible={this.props.showNotVisible}
                                     fieldsForType={this.props.fieldsForType}
                        />
                    </div>
            </SortAndGroupDialogWrapped>) :
            null
        );
    }
});

export default SortAndGroupDialog;
