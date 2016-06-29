import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import {Button} from 'react-bootstrap';
import OverlayDialogHeader from '../overlay/overlayDialogHeader';
import FieldSettings from './fieldSettings';
import FieldsPanel from './fieldsPanel';
import sortGroupFieldShape from './sortGroupProp';
import thwartClicksWrapper from '../hoc/thwartClicksWrapper';
import closeOnEscape from '../hoc/catchEscapeKey';
import QBToolTip from '../qbToolTip/qbToolTip';

import './sortAndGroup.scss';
import '../../assets/css/vendor/animate.min.css';

var SortAndGroupDialog = React.createClass({

    propTypes: {
        // whether to show this popover sort/group dialog or not
        show: React.PropTypes.bool,

        // whether to show the fields list to select from or not
        showFields: React.PropTypes.bool,

        // whether to list the fields that are not in the report or not
        showNotVisible: React.PropTypes.bool,

        // when showing the fields list to select from whether it's for sort or group
        fieldsForType: React.PropTypes.string,

        // the report data model
        reportData:  React.PropTypes.object,

        // the list of field settings to use in grouping
        groupByFields: React.PropTypes.arrayOf(sortGroupFieldShape),

        // the list of field settings to use in sorting
        sortByFields: React.PropTypes.arrayOf(sortGroupFieldShape),

        // the list of fields available to select from for sorting or grouping
        // per design spec only fields not yet used already in sort or group
        // are available, fields not visible in report are also available for selection
        fieldChoiceList: React.PropTypes.array,

        // the visible fields in the reports table groups
        visGroupEls: React.PropTypes.array,

        // the callback that is used when ready to close/hide this popover
        onClose: React.PropTypes.func,

        // the callback that is used when any adhoc sort/group should be cancelled
        // and revert back to the original reports sort/group settings
        onReset: React.PropTypes.func,

        // the callback that is used when any adhoc sort/group should be applied and
        // the report updated
        onApplyChanges: React.PropTypes.func,

        // the callback that is used when click outside this popover occurred
        handleClickOutside: React.PropTypes.func,

        // the callback that is used when the list of fields avail to chose from should show
        onShowFields: React.PropTypes.func,

        // the callback that is used when the list of fields avail to chose from should hide
        onHideFields: React.PropTypes.func,

        // the callback that is used to remove a selected field
        onRemoveField: React.PropTypes.func,

        // the callback that is used to change the fields order ascending / descending
        onSetOrder: React.PropTypes.func,

        // the callback that is used when selecting a field to add for sortibg/grouping
        onSelectField: React.PropTypes.func,

        // the callback that is used when showing the fields that are not visible in the report
        // for selection
        onShowMoreFields: React.PropTypes.func,
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
                              key={type + "Settings"}
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
     later story action to order the items in sort/group list dnd

     states to maintain
     dialog hidden shown
     edited groups array - last field selected -
     edited sorts array

     queries for is field in list of sort fields2, in list of group fields

     */
    render() {
        // wrap the sort dialog in additional functionality to close the dialog on escape
        // and to not handle any outside clicks while the dialog is open
        const SortAndGroupWrapper = React.createClass({
            render() {
                return <div key="sng"
                    {...this.props}>
                </div>;
            }
        });
        let SortAndGroupDialogWrapped = thwartClicksWrapper(closeOnEscape(SortAndGroupWrapper));

        return (
            this.props.show ? (
            <SortAndGroupDialogWrapped container={this} id="sortAndGroupDialog"
                     className="sortAndGroupDialog"
                     outsideClickIgnoreClass="sortAndGroupContainer"
                     handleClickOutside={this.handleClickOutside}
                     onClose={this.props.onClose}
                     placement="bottom">

                        <div className={"settingsDialog" + (this.props.showFields ? ' fieldsShown' : '')} key="sgSettings">
                            <div className="dialogUpper">
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
                            </div>
                            <div className="dialogBottom">
                                <div className="dialogButtons">
                                    <QBToolTip location="top" tipId="resetSrtGrpIcon" i18nMessageKey="report.sortAndGroup.resetTip">
                                         <span className="action reset" tabIndex="0" onClick={this.props.onReset}>
                                            <I18nMessage message="report.sortAndGroup.reset"/>
                                         </span>
                                    </QBToolTip>
                                    <QBToolTip location="top" tipId="applySrtGrpIcon"
                                               i18nMessageKey="applyTip">
                                         <Button className={"apply " + this.props.dirty}  bsStyle="primary"
                                                 onClick={this.props.onApplyChanges}>
                                             <I18nMessage message="apply"/>
                                         </Button>
                                    </QBToolTip>
                                 </div>
                                <div className="dialogBand">
                                    <QBToolTip location="top" tipId="resetSrtGrpIcon" i18nMessageKey="report.sortAndGroup.resetTip">
                                        <div className="action reset" tabIndex="0" onClick={this.props.onReset}>
                                            <I18nMessage message="report.sortAndGroup.reset"/>
                                        </div>
                                    </QBToolTip>
                                </div>
                            </div>
                        </div>
                        <FieldsPanel onHideFields={this.props.onHideFields}
                                     showFields={this.props.showFields}
                                     fieldChoiceList={this.props.fieldChoiceList}
                                     reportColumns={this.props.reportData &&
                                        this.props.reportData.data ?
                                        this.props.reportData.data.columns :  null}
                                     visGroupEls={this.props.visGroupEls}
                                     sortByFields={this.props.sortByFields}
                                     groupByFields={this.props.groupByFields}
                                     onSelectField={this.props.onSelectField}
                                     onShowMoreFields={this.props.onShowMoreFields}
                                     showNotVisible={this.props.showNotVisible}
                                     fieldsForType={this.props.fieldsForType}
                                     key="fieldsPanel"
                        />
            </SortAndGroupDialogWrapped>) :
                null
        );
    }
});

export default SortAndGroupDialog;
