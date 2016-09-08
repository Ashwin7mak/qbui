
const basicNumericField = (
    <div>
        <dt>Plain Numeric Field:</dt>
        <dd>
              <NumericFieldValueRenderer value="23.45" />
        </dd>

        <dt>Bold Numeric Field:</dt>
        <dd>
              <NumericFieldValueRenderer value="23.45" isBold={true}/>
        </dd>

        <dt>Numeric Field with some added bootstrap classes:</dt>
        <dd>
              <NumericFieldValueRenderer value="23.45" classes="mark lead"/>
        </dd>
    </div>
);

ReactDOM.render(basicNumericField, mountNode);


