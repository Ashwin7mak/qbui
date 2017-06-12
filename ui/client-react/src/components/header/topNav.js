/**
 * The original file in this location has moved to the reuse library.
 * What remains here is a stub so existing code does not have to change yet.
 **/
import TopNav from '../../../../reuse/client/src/components/topNav/topNav';
import {connect} from 'react-redux';

const mapStateToProps = (state) => {
    return {
        showOnSmall:state.shell.topNavVisible
    };
};


export default connect(
    mapStateToProps
)(TopNav);
