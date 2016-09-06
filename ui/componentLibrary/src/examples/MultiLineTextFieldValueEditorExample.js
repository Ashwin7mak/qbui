let exampleList = 'Aaliyah \n Abigail \n Addison \n Agatha \n Alex \n Alexa \n Alexandra \n Alexis';

const basicMultiLineTextFieldValueEditor = (
    <div>
        <dt>Empty Text Field Editor:</dt>
        <dd>
            <MultiLineTextFieldValueEditor value={exampleList}/>
        </dd>


    </div>
);
ReactDOM.render(basicMultiLineTextFieldValueEditor, mountNode);
