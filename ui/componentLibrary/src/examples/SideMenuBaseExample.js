// This is a basic example for the React playground
// Please update to include other properties or states for your component

const SideMenuContent = (
    <div className="customSideMenuContent">
        <h2>Side Menu</h2>
        <ul>
            <li>Nav Link 1</li>
            <li>Nav Link 2</li>
            <li>Nav Link 3</li>
            <li>Nav Link 4</li>
        </ul>
    </div>
);

const ExampleParentComponent = React.createClass({
    getInitialState() {
        return {
            isOpen: false,
            isCollapsed: false,
            willDock: true,
            pullRight: false,
        }
    },

    toggleIsOpen() {this.setState({isOpen: !this.state.isOpen})},

    toggleIsCollapsed() {this.setState({isCollapsed: !this.state.isCollapsed})},

    toggleWillDock() {this.setState({willDock: !this.state.willDock})},

    togglePullRight() {this.setState({pullRight: !this.state.pullRight})},

    render() {
        return (
            <div className="SideMenuExample" style={{height: '300px', overflow: 'hidden'}}>
                <SideMenuBase
                    sideMenuContent={SideMenuContent}
                    isOpen={this.state.isOpen}
                    isCollapsed={this.state.isCollapsed}
                    pullRight={this.state.pullRight}
                    willDock={this.state.willDock}
                >
                    <div className="options">
                        <label>
                            <input type="checkbox" checked={this.state.isOpen} onChange={this.toggleIsOpen} /> isOpen?
                        </label>

                        <br/>

                        <label>
                            <input type="checkbox" checked={this.state.isCollapsed} onChange={this.toggleIsCollapsed} /> isCollapsed?
                        </label>

                        <br/>

                        <label>
                            <input type="checkbox" checked={this.state.pullRight} onChange={this.togglePullRight} /> pullRight?
                        </label>

                        <br/>

                        <label>
                            <input type="checkbox" checked={this.state.willDock} onChange={this.toggleWillDock} /> willDock?
                        </label>
                        <p><b>Note:</b> `willDock` will not show its effects until the window size is changed. (Controls menu docking at larger break points)</p>
                    </div>
                </SideMenuBase>
            </div>
        );
    }
});

const basicSideMenuBaseExample = (<ExampleParentComponent/>);

ReactDOM.render(basicSideMenuBaseExample, mountNode);
