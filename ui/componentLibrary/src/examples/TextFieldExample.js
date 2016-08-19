
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
    </div>
);

ReactDOM.render(basicTextField, mountNode);


