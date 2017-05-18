import React from 'react';
import configureMockStore from 'redux-mock-store';
import {Provider} from "react-redux";
import {Link} from 'react-router-dom';
import {MemoryRouter} from 'react-router-dom';
import {mount, shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import serverTypeConsts from '../../../common/src/constants';

import EmbeddedAddChildLink, {
    EmbeddedAddChildLink as UnconnectedEmbeddedAddChildLink,
    __RewireAPI__ as EmbeddedAddChildLinkRewireAPI
}  from '../../src/components/report/embedded/embeddedAddChildLink';
const mockStore = configureMockStore();

describe('EmbeddedAddChildLink', () => {
    let component;

    const appId = 1;
    const childTableId = 2;
    const childReportId = 3;
    const detailKeyFid = 4;
    const detailKeyValue = 5;
    const childTableNoun = 'Child Table';
    const uniqueId = 'CONTEXT_ADD_TEST';
    const props = {
        appId,
        childTableId,
        childReportId,
        detailKeyFid,
        detailKeyValue,
        childTableNoun,
        uniqueId
    };


    const LinkMock = React.createClass({
        render() {
            return <div className="linkMock">{this.props.children}</div>;
        }
    });


    beforeAll(() => {
        jasmineEnzyme();
        EmbeddedAddChildLinkRewireAPI.__Rewire__('Link', LinkMock);

    });

    afterAll(() => {
        EmbeddedAddChildLinkRewireAPI.__ResetDependency__('Link');
    });

    it('renders component', () => {
        const store = mockStore({embeddedReports: {}});

        component = mount(
            <MemoryRouter>
                <Provider store={store}>
                    <EmbeddedAddChildLink />
                </Provider>
            </MemoryRouter>
                );
        expect(component).toBePresent();
    });


    it('renders a Link', () => {
        component = mount(
            <UnconnectedEmbeddedAddChildLink
                {...props} />
        );
        expect(component.find(LinkMock).length).toEqual(1);
    });

    it(`displays child table's name`, () => {
        component = mount(
            <UnconnectedEmbeddedAddChildLink
                {...props} />
        );
        expect(component.text()).toContain(childTableNoun.toLowerCase());
    });

});
