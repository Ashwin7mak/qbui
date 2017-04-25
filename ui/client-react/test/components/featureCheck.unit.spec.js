import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {FeatureCheck} from '../../src/components/featureSwitches/featureCheck';

describe('FeatureCheck', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    const featureStates = [
        {name: 'Feature A', status: true},
        {name: 'Feature B', status: false}
    ];

    it('renders a component when feature is on', () => {
        const wrapper = shallow(
            <FeatureCheck featureName={"Feature A"} states={featureStates}>
                <div className="child"/>
            </FeatureCheck>);

        expect(wrapper.contains(<div className="child"/>)).toBe(true);
    });

    it('does not render a component when feature is off', () => {
        const wrapper = shallow(
            <FeatureCheck featureName={"Feature B"} states={featureStates}>
                <div className="child"/>
            </FeatureCheck>);

        expect(wrapper.contains(<div className="child"/>)).toBe(false);
    });

    it('does not render a component when feature is on but show=false', () => {
        const wrapper = shallow(
            <FeatureCheck featureName={"Feature A"} show={false} states={featureStates}>
                <div className="child"/>
            </FeatureCheck>);

        expect(wrapper.contains(<div className="child"/>)).toBe(false);
    });

    it('does not render a component when feature is not present', () => {
        const wrapper = shallow(
            <FeatureCheck featureName={"Feature Unknown"} states={featureStates}>
                <div className="child"/>
            </FeatureCheck>);

        expect(wrapper.contains(<div className="child"/>)).toBe(false);
    });

    it('does not render a component when feature is not present and show=false', () => {
        const wrapper = shallow(
            <FeatureCheck featureName={"Feature Unknown"} show={false} states={featureStates}>
                <div className="child"/>
            </FeatureCheck>);

        expect(wrapper.contains(<div className="child"/>)).toBe(false);
    });
});
