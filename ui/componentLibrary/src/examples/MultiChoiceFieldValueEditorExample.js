let choices = [
    {
        coercedValue: {
            value: "Ellie"
        },
        displayValue: "Ellie"
    },
    {
        coercedValue: {
            value: "Castedo"
        },
        displayValue: "Castedo"
    },
    {
        coercedValue: {
            value: "Franca"
        },
        displayValue: "Franca"
    },
    {
        coercedValue: {
            value: "Valesca"
        },
        displayValue: "Valesca"
    },
    {
        coercedValue: {
            value: "Johnny Blaze"
        },
        displayValue: "Johnny Blaze"
    },
    {
        coercedValue: {
            value: "Jeff"
        },
        displayValue: "Jeff"
    },
    {
        coercedValue: {
            value: "Robert"
        },
        displayValue: "Robert"
    },
    {
        coercedValue: {
            value: "Check"
        },
        displayValue: "Check"
    }
];

const basicMultiChoiceFieldValueEditor = (
    <div>
        <dt>Multi Choice Field Editor:</dt>
        <div style={{width:200}}>
            <dd>
                <MultiChoiceFieldValueEditor choices = {choices} value="Jeff"/>
            </dd>
        </div>
        <dt>Multi Choice Field Editor Radio Buttons:</dt>
        <dd>
            <MultiChoiceFieldValueEditor showAsRadio={true} choices={choices} value="Jeff" radioGroupName="exampleRadioGroup"/>
        </dd>
    </div>
);
ReactDOM.render(basicMultiChoiceFieldValueEditor, mountNode);
