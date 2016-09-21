
const user = {
    screenName: "myScreenName",
    email: "john.doe@email.com"
};
const display = "John Doe";

const userValueField = (
    <div>
        <dt>User Value Field:</dt>
        <dd>
            <div style={{display: "inline-block"}}>
              <UserFieldValueRenderer value={user} display={display} />
            </div>
        </dd>

    </div>
);

ReactDOM.render(userValueField, mountNode);


