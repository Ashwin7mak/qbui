
let textValue1 = 'QuickBase';
let textDisplay1 = 'QUICKBASE';
let textValue2 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel semper felis. Nunc quis metus hendrerit, lobortis purus dapibus, pulvinar sapien. Nunc ornare cursus sodales. Nulla consequat est ligula, sit amet iaculis metus pharetra id. Vestibulum nibh odio, euismod ac vehicula at, tincidunt condimentum lacus. ';
let numberValue3 = 123456789;

let fieldDefWithBold = {
    "clientSideAttributes" : {"bold" : true}
};


const basicFieldValueRenderer = (
    <div>
        <dt>Empty Field Renderer:</dt>
        <dd>
            <FieldValueRenderer />
        </dd>


        <dt>Field Renderer (default text) with a value:</dt>
        <dd>
            <FieldValueRenderer value={textValue1} />
        </dd>

        <dt>Field Renderer with Text Field type and a value and display:</dt>
            <dd>
                <FieldValueRenderer type={1} value={textValue1} display={textDisplay1} />
            </dd>

        <dt>Field Renderer with Text Field type, bold attribute and a display: </dt>
        <dd>
            <FieldValueRenderer type={1} display={textDisplay1} attributes={fieldDefWithBold} />
        </dd>

        <dt>Field Renderer with Numeric Field type and a value {numberValue3} which is formatted according to the current locale:</dt>
        <dd>
            <FieldValueRenderer type={2} value={numberValue3} display="this is not used" />
        </dd>

    </div>
);
ReactDOM.render(basicFieldValueRenderer, mountNode);
