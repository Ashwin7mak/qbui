import React from 'react';

var LoadingScreen = () => {
    return (
        <div className="loadingScreen">
            <div className="leftNav">
            </div>
            <div className="mainBody">
                <div className="topNav">
                </div>
                <div className="header">
                    <div className="addButton"></div>
                </div>
                <div className="mainContent">
                    {/*<span className="loadingSpinner"></span>*/}
                    <div className="sk-circle">
                        <div className="sk-circle1 sk-child"></div>
                        <div className="sk-circle2 sk-child"></div>
                        <div className="sk-circle3 sk-child"></div>
                        <div className="sk-circle4 sk-child"></div>
                        <div className="sk-circle5 sk-child"></div>
                        <div className="sk-circle6 sk-child"></div>
                        <div className="sk-circle7 sk-child"></div>
                        <div className="sk-circle8 sk-child"></div>
                        <div className="sk-circle9 sk-child"></div>
                        <div className="sk-circle10 sk-child"></div>
                        <div className="sk-circle11 sk-child"></div>
                        <div className="sk-circle12 sk-child"></div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default LoadingScreen;
