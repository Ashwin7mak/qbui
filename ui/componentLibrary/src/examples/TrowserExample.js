// This is a basic example for the React playground
// Please update to include other properties or states for your component

var BasicTrowserExample = React.createClass({
    getInitialState() {
        return {
            trowserOpen: false
        };
    },

    toggleTrowser() {
        this.setState({trowserOpen: !this.state.trowserOpen});
    },

    render() {
        return (<div>
            <div>
                <button onClick={this.toggleTrowser} >Toggle Trowser</button>
            </div>

            <div style={{position:"relative", height:"300px", overflow:"hidden", marginTop:"12px"}}>
                <Trowser visible={this.state.trowserOpen}
                         onCancel={() => {this.setState({trowserOpen: false});}}
                         breadcrumbs={<div>Breadcrumbs go here</div>}
                         content={<div>Content goes here</div>}
                         centerActions={<div className="centerActions">Center goes here</div>}
                         rightIcons={<div>Right goes here</div>}/>
            </div>
        </div>);
    }
});

ReactDOM.render(<BasicTrowserExample />, mountNode);
