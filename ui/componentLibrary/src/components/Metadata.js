import QBPanelMetadata from 'component-metadata!../../../client-react/src/components/QBPanel/qbpanel.js';
import QBIconMetadata from 'component-metadata!../../../client-react/src/components/qbIcon/qbIcon.js';
import TextFieldValueRendererMetadata from 'component-metadata!../../../client-react/src/components/fields/textFieldValueRenderer.js';
import TextFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/textFieldValueEditor.js';
import FieldValueRendererMetadata from 'component-metadata!../../../client-react/src/components/fields/fieldValueRenderer.js';
import FieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/fieldValueEditor.js';
import MultiLineTextFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/multiLineTextFieldValueEditor.js';
import NumericFieldValueRendererMetadata from 'component-metadata!../../../client-react/src/components/fields/numericFieldValueRenderer.js';
import NumericFieldValueEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/numericFieldValueEditor.js';
import _ from 'lodash';

var Metadata = _.merge(QBPanelMetadata, QBIconMetadata,
    TextFieldValueRendererMetadata, TextFieldValueEditorMetadata,
    FieldValueRendererMetadata, FieldValueEditorMetadata, MultiLineTextFieldValueEditorMetadata);
    FieldValueRendererMetadata, FieldValueEditorMetadata,
    NumericFieldValueRendererMetadata, NumericFieldValueEditorMetadata);

export default Metadata;
