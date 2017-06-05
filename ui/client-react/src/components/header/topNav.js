/**
 * The original file in this location has moved to the reuse library.
 * What remains here is a stub so existing code does not have to change yet.
 **/
import TopNav from '../../../../reuse/client/src/components/topNav/topNav';

const mapStateToProps = (state) => {
    return {
        title: state.shell.navTopTitle,
        showOnSmall:state.shell.topNavVisible
    };
};


export default connect(
    mapStateToProps
)(TopNav);
