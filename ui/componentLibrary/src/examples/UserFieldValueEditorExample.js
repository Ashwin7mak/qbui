
const appUsers = [
    {
        email: "user1@email.com",
        firstName: "John",
        lastName: "Smith",
        screenName: "firstuser",
        userId: "1"
    },
    {
        email: "user2@email.com",
        firstName: "John",
        lastName: "Smith",
        userId: "2"
    },
    {
        email: "user3@email.com",
        userId: "3"
    },
    {
        email: "user4@email.com",
        firstName: "John",
        lastName: "Smith",
        userId: "4"
    },
    {
        email: "user5@email.com",
        firstName: "John",
        lastName: "Smith",
        deactivated: true,
        userId: "5"
    }
];

const fieldDef = {
    builtIn: false,
    dataTypeAttributes: {
        type: "USER",
        userDisplayFormat: "FIRST_THEN_LAST"
    },
    required: true
};

var BasicUserFieldValueEditor = React.createClass({

    render() {
        return (
            <div>
                <dt>User Field Editor:</dt>
                    <dd>
                        <UserFieldValueEditor value={{userId: "1"}} appUsers={appUsers} fieldDef={fieldDef}/>
                    </dd>


            </div>
        );
    }
});

ReactDOM.render(<BasicUserFieldValueEditor />, mountNode);

