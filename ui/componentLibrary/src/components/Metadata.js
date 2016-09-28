import _ from 'lodash';

import CheckBoxFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/checkBoxFieldValueEditor.js';
import CheckBoxFieldValueRendererMetadata from 'component-metadata!../../../client-react/src/components/fields/checkBoxFieldValueRenderer.js';
import DateFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/dateFieldValueEditor.js';
import DateTimeFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/dateTimeFieldValueEditor.js';
import DateTimeFieldValueRendererMetadata from 'component-metadata!../../../client-react/src/components/fields/dateTimeFieldValueRenderer.js';
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
import UserFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/userFieldValueEditor.js';
import UserFieldValueRendererMetadata from 'component-metadata!../../../client-react/src/components/fields/userFieldValueRenderer.js';

import QBIconMetadata from 'component-metadata!../../../client-react/src/components/qbIcon/qbIcon.js';
import QBPanelMetadata from 'component-metadata!../../../client-react/src/components/QBPanel/qbpanel.js';

// END OF IMPORT STATEMENTS
// above comment used for grunt task, please do not delete

var Metadata = _.merge(
    CheckBoxFieldValueEditorMetadata,
    CheckBoxFieldValueRendererMetadata,
    DateFieldValueEditorMetadata,
    DateTimeFieldValueEditorMetadata,
    DateTimeFieldValueRendererMetadata,
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
    UserFieldValueEditorMetadata,
    UserFieldValueRendererMetadata,
    QBIconMetadata,
    QBPanelMetadata

    // END OF METADATA MERGE
    // above comment used for grunt task, please do not delete
);

export default Metadata;
