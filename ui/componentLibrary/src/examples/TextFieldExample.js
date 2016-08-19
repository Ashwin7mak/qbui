
const basicTextField = (
    <div>
        <dt>Plain Text Field:</dt>
        <dd>
              <TextField value="QuickBase" />
        </dd>

        <dt>Bold Text Field:</dt>
        <dd>
              <TextField value="QuickBase" isBold={true}/>
        </dd>

        <dt>Text Field with some added bootstrap classes:</dt>
        <dd>
              <TextField value="QuickBase" classes="mark lead"/>
        </dd>
    </div>
);

ReactDOM.render(basicTextField, mountNode);


