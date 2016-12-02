// This is a basic example for the React playground
// Please update to include other properties or states for your component

const basicPhoneFieldValueRendererExample = (
    <div>
        <dt>Phone Number Without Ext:</dt>
        <p>(Will Display smsIcon and phoneIcon on smallBreakpoint)</p>
        <dd>
            <PhoneFieldValueRenderer display="(555) 555-5555"
                                     value="5555555555" />
        </dd>
        <dt>Phone Number With Ext: </dt>
        <dd>
            <PhoneFieldValueRenderer display="(555) 555-5555 x5555"
                                     value="5555555555" />
        </dd>
    </div>
);

ReactDOM.render(basicPhoneFieldValueRendererExample, mountNode);
