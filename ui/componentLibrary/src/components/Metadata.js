import _ from 'lodash';

import CheckBoxFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/checkBoxFieldValueEditor.js';
import CheckBoxFieldValueRendererMetadata from 'component-metadata!../../../client-react/src/components/fields/checkBoxFieldValueRenderer.js';
import FieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/fieldValueEditor.js';
import FieldValueRendererMetadata from 'component-metadata!../../../client-react/src/components/fields/fieldValueRenderer.js';
import MultiLineTextFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/multiLineTextFieldValueEditor.js';
import NumericFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/numericFieldValueEditor.js';
import NumericFieldValueRendererMetadata from 'component-metadata!../../../client-react/src/components/fields/numericFieldValueRenderer.js';
import TextFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/textFieldValueEditor.js';
import TextFieldValueRendererMetadata from 'component-metadata!../../../client-react/src/components/fields/textFieldValueRenderer.js';
import QBIconMetadata from 'component-metadata!../../../client-react/src/components/qbIcon/qbIcon.js';
import QBPanelMetadata from 'component-metadata!../../../client-react/src/components/QBPanel/qbpanel.js';

var Metadata = _.merge(
    CheckBoxFieldValueEditorMetadata,
    CheckBoxFieldValueRendererMetadata,
    FieldValueEditorMetadata,
    FieldValueRendererMetadata,
    MultiLineTextFieldValueEditorMetadata,
    NumericFieldValueEditorMetadata,
    NumericFieldValueRendererMetadata,
    TextFieldValueEditorMetadata,
    TextFieldValueRendererMetadata,
    QBIconMetadata,
    QBPanelMetadata
);

export default Metadata;
