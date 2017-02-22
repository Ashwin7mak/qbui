import React from 'react';

import './dragHandle.scss';

const DragHandle = () => {
    let dots = [];
    for (var i = 0; i < 8; i++) {
        dots.push(i);
    }

    dots = dots.map(dot => <div key={`dot${dot}`} className={`dot dot${dot}`}/>);

    return (
        <div className="dragHandle">
            {dots}
        </div>
    );
};

export default DragHandle;
