import React from 'react';
import BodyMovin from "../bodyMovin/bodyMovin";
import QbLoaderAnimationData from "../../assets/animations/QbLoaderAnimationData.json";

/**
 * The component that composes BodyMovin to enhance its functionality of
 * rendering the new QBLoader from a JSON object
 */
const QbLoader = (props) => <BodyMovin animationData={QbLoaderAnimationData}
                                       className={props.className}
                            />;

export default QbLoader;
