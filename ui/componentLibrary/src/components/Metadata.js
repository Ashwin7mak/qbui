import QBPanelMetadata from 'component-metadata!../../../client-react/src/components/QBPanel/qbpanel.js';
import QBIconMetadata from 'component-metadata!../../../client-react/src/components/qbIcon/qbIcon.js';
import TextFieldMetadata from 'component-metadata!../../../client-react/src/components/fields/textField.js';
import TextFieldEditorMetadata from 'component-metadata!../../../client-react/src/components/fields/textFieldEditor.js';
import _ from 'lodash';

var Metadata = _.merge(QBPanelMetadata, QBIconMetadata, TextFieldMetadata, TextFieldEditorMetadata);

export default Metadata;
