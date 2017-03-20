import _ from 'lodash';

import CheckBoxFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/checkBoxFieldValueEditor.js';
import CheckBoxFieldValueRendererMetadata from 'component-metadata!../../../client-react/src/components/fields/checkBoxFieldValueRenderer.js';
import DateFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/dateFieldValueEditor.js';
import DateTimeFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/dateTimeFieldValueEditor.js';
import DateTimeFieldValueRendererMetadata from 'component-metadata!../../../client-react/src/components/fields/dateTimeFieldValueRenderer.js';
import EmailFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/emailFieldValueEditor.js';
import EmailFieldValueRendererMetadata from 'component-metadata!../../../client-react/src/components/fields/emailFieldValueRenderer.js';
import FieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/fieldValueEditor.js';
import FieldValueRendererMetadata from 'component-metadata!../../../client-react/src/components/fields/fieldValueRenderer.js';
import MultiChoiceFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/multiChoiceFieldValueEditor.js';
import MultiLineTextFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/multiLineTextFieldValueEditor.js';
import NumericFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/numericFieldValueEditor.js';
import NumericFieldValueRendererMetadata from 'component-metadata!../../../client-react/src/components/fields/numericFieldValueRenderer.js';
import TextFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/textFieldValueEditor.js';
import TextFieldValueRendererMetadata from 'component-metadata!../../../client-react/src/components/fields/textFieldValueRenderer.js';
import TimeFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/timeFieldValueEditor.js';
import TimeFieldValueRendererMetadata from 'component-metadata!../../../client-react/src/components/fields/timeFieldValueRenderer.js';
import UrlFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/urlFieldValueEditor.js';
import UrlFieldValueRendererMetadata from 'component-metadata!../../../client-react/src/components/fields/urlFieldValueRenderer.js';
import UserFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/userFieldValueEditor.js';
import UserFieldValueRendererMetadata from 'component-metadata!../../../client-react/src/components/fields/userFieldValueRenderer.js';

import IconMetadata from 'component-metadata!../../../reuse/client/src/components/icon/icon.js';
import QBPanelMetadata from 'component-metadata!../../../client-react/src/components/QBPanel/qbpanel.js';

import TrowserMetadata from 'component-metadata!../../../client-react/src/components/trowser/trowser.js';
import QBModalMetadata from 'component-metadata!../../../client-react/src/components/qbModal/qbModal.js';
import AlertBannerMetadata from 'component-metadata!../../../client-react/src/components/alertBanner/alertBanner.js';
import InvisibleBackdropMetadata from 'component-metadata!../../../client-react/src/components/qbModal/invisibleBackdrop.js';
import PageTitleMetadata from 'component-metadata!../../../client-react/src/components/pageTitle/pageTitle.js';
import PhoneFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/phoneFieldValueEditor.js';
import PhoneFieldValueRendererMetadata from 'component-metadata!../../../client-react/src/components/fields/phoneFieldValueRenderer.js';
import DurationFieldValueRendererMetadata from 'component-metadata!../../../client-react/src/components/fields/durationFieldValueRenderer.js';
import DurationFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/durationFieldValueEditor.js';
import QbGridMetadata from 'component-metadata!../../../client-react/src/components/dataTable/qbGrid/qbGrid.js';
import SideMenuBaseMetadata from 'component-metadata!../../../reuse/client/src/components/sideMenuBase/sideMenuBase.js';
// END OF IMPORT STATEMENTS
// above comment used for grunt task, please do not delete

var Metadata = () => {
    let metaDataObject = {
        CheckBoxFieldValueEditorMetadata,
        CheckBoxFieldValueRendererMetadata,
        DateFieldValueEditorMetadata,
        DateTimeFieldValueEditorMetadata,
        DateTimeFieldValueRendererMetadata,
        EmailFieldValueEditorMetadata,
        EmailFieldValueRendererMetadata,
        FieldValueEditorMetadata,
        FieldValueRendererMetadata,
        MultiChoiceFieldValueEditorMetadata,
        MultiLineTextFieldValueEditorMetadata,
        NumericFieldValueEditorMetadata,
        NumericFieldValueRendererMetadata,
        TextFieldValueEditorMetadata,
        TextFieldValueRendererMetadata,
        TimeFieldValueEditorMetadata,
        TimeFieldValueRendererMetadata,
        TrowserMetadata,
        UrlFieldValueEditorMetadata,
        UrlFieldValueRendererMetadata,
        UserFieldValueEditorMetadata,
        UserFieldValueRendererMetadata,
        IconMetadata,
        QBPanelMetadata,
        QBModalMetadata,
        AlertBannerMetadata,
        PageTitleMetadata,
        InvisibleBackdropMetadata,
        PhoneFieldValueEditorMetadata,
        PhoneFieldValueRendererMetadata,
        DurationFieldValueRendererMetadata,
        DurationFieldValueEditorMetadata,
        QbGridMetadata,
        SideMenuBaseMetadata,
        // END OF METADATA MERGE
        // above comment used for grunt task, please do not delete
    };

    /**
     * Transforms the metadata for each import into one that can be interpreted by the renderer.
     * If the transformation fails during import, then a standard message is displayed.
     */
    return Object.keys(metaDataObject).reduce((newMetaObject, originalKeyName) => {
        let newKeyName = originalKeyName.replace('Metadata', '');

        if (_.has(metaDataObject, `${originalKeyName}.${newKeyName}`)) {
            newMetaObject[newKeyName] = metaDataObject[originalKeyName][newKeyName];
        } else {
            newMetaObject[newKeyName] = metaDataObject[originalKeyName];
        }

        if (Object.keys(newMetaObject[newKeyName]).length === 0) {
            newMetaObject[newKeyName] = {
                descHtml: `<h3>This component was created using the new class or function syntax. Props cannot be displayed. Check the source code.</h3>`,
                props: false
            };
        }

        return newMetaObject;
    }, {});
};

export default Metadata();
