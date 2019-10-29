import React from 'react';
import {shallow} from 'enzyme';
import {ApplicationWizardConfirmationComponent} from '../../../containers/Applications/ApplicationWizardConfirmation';

describe('ApplicationWizardConfirmationComponent', () => {
  it('should render the summary confirmation component', () => {
    const query = {
      application: {
        formResultsByApplicationId: {
          edges: [{node: {formResult: '{"id": "form-results"}'}}]
        }
      }
    };
    const r = shallow(<ApplicationWizardConfirmationComponent query={query} />);
    expect(r).toMatchSnapshot();
    expect(
      r
        .find(
          'ForwardRef(Relay(ApplicationWizardConfirmationCardItemComponent))'
        )
        .prop('formTitle')
    ).toBe('id');
  });
});
