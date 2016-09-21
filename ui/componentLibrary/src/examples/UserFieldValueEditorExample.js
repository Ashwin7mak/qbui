
const appUsers = [
    {
        email: "john.doe@email.com",
        firstName: "John",
        lastName: "Doe",
        screenName: "john",
        userId: "1"
    },
    {
        email: "john.doe2@email.com",
        firstName: "John",
        lastName: "Doe",
        userId: "2"
    },
    {
        email: "someone@email.com",
        userId: "3"
    },
    {
        email: "jsmith@somewhere.com",
        firstName: "John",
        lastName: "Smith",
        userId: "4"
    },
    {
        email: "mary.jones@company.com",
        firstName: "Mary",
        lastName: "Jones",
        deactivated: true,
        userId: "5"
    }
];

const fieldDef1 = {
    builtIn: false,
    datatypeAttributes: {
        type: "USER",
        userDisplayFormat: "FIRST_THEN_LAST"
    },
};

const fieldDef2 = {
    builtIn: false,
    dataTtypeAttributes: {
        type: "USER",
        userDisplayFormat: "LAST_THEN_FIRST",
    },
    required:true
};
var BasicUserFieldValueEditor = React.createClass({

    render() {
        return (
            <div>
                <dt>User Field Editor (FIRST_THEN_LAST):</dt>
                    <dd>
                        <UserFieldValueEditor value={{userId: "1"}} appUsers={appUsers} fieldDef={fieldDef1}/>
                    </dd>

                <dt>User Field Editor (LAST_THEN_FIRST, required):</dt>
                <dd>
                    <UserFieldValueEditor value={{userId: "1"}} appUsers={appUsers} fieldDef={fieldDef2}/>
                </dd>
            </div>


        );
    }
});

ReactDOM.render(<BasicUserFieldValueEditor />, mountNode);

