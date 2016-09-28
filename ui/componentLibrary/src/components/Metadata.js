import QBPanelMetadata from 'component-metadata!../../../client-react/src/components/QBPanel/qbpanel.js';
import QBIconMetadata from 'component-metadata!../../../client-react/src/components/qbIcon/qbIcon.js';
import TextFieldValueRendererMetadata from 'component-metadata!../../../client-react/src/components/fields/textFieldValueRenderer.js';
import TextFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/textFieldValueEditor.js';
import FieldValueRendererMetadata from 'component-metadata!../../../client-react/src/components/fields/fieldValueRenderer.js';
import FieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/fieldValueEditor.js';
import MultiLineTextFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/multiLineTextFieldValueEditor.js';
import NumericFieldValueRendererMetadata from 'component-metadata!../../../client-react/src/components/fields/numericFieldValueRenderer.js';
import NumericFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/numericFieldValueEditor.js';
import MultiChoiceFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/multiChoiceFieldValueEditor.js';
import UserFieldValueRendererMetadata from 'component-metadata!../../../client-react/src/components/fields/userFieldValueRenderer.js';
import UserFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/userFieldValueEditor.js';
import DateFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/dateFieldValueEditor.js';
import TimeFieldValueRendererMetadata from 'component-metadata!../../../client-react/src/components/fields/timeFieldValueRenderer.js';
import TimeFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/timeFieldValueEditor.js';
import DateTimeFieldValueRendererMetadata from 'component-metadata!../../../client-react/src/components/fields/dateTimeFieldValueRenderer.js';
import DateTimeFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/dateTimeFieldValueEditor.js';
// END OF IMPORT STATEMENTS
// above comment used for grunt task, please do not delete

import _ from 'lodash';

var Metadata = _.merge(
    QBPanelMetadata,
    QBIconMetadata,
    TextFieldValueRendererMetadata,
    TextFieldValueEditorMetadata,
    FieldValueRendererMetadata,
    FieldValueEditorMetadata,
    MultiLineTextFieldValueEditorMetadata,
    NumericFieldValueRendererMetadata,
    NumericFieldValueEditorMetadata,
    UserFieldValueRendererMetadata,
    UserFieldValueEditorMetadata,
    MultiChoiceFieldValueEditorMetadata,
    DateFieldValueEditorMetadata,
    TimeFieldValueRendererMetadata,
    TimeFieldValueEditorMetadata,
    DateTimeFieldValueRendererMetadata,
    DateTimeFieldValueEditorMetadata
    // END OF METADATA MERGE
    // above comment used for grunt task, please do not delete
);

export default Metadata;
