
const user = {
    screenName: "screenname",
    email: "email@email.com"
};
const display = "display name";

const userValueField = (
    <div>
        <dt>User Value Field:</dt>
        <dd>
              <UserFieldValueRenderer value={user} display={display} />
        </dd>

    </div>
);

ReactDOM.render(userValueField, mountNode);


