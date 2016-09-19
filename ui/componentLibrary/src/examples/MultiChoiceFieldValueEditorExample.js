let choices = [
        {
            coercedValue: {
                value: ""
            },
            displayValue: ""
        }, {
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
    ]

const basicMultiChoiceFieldValueEditor = (
    <div>
        <dt>Multi Choice Field Editor:</dt>
        <dd>
            <MultiChoiceFieldValueEditor choices = {choices} />
        </dd>


    </div>
);
ReactDOM.render(basicMultiChoiceFieldValueEditor, mountNode);
