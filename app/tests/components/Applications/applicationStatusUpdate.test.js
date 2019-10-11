import React from 'react';
// Import {wait, render} from '@testing-library/react';
import {shallow} from 'enzyme';
import ApplicationStatusUpdate from '../../../components/Applications/ApplicationStatusUpdate';

const application = {
  applicationStatus: 'pending',
  displayStatus: 'Pending'
};

describe('Application Status UPdate', () => {
  it('should render the application status', async () => {
    const r = shallow(
      <ApplicationStatusUpdate
        applicationStatus={application.applicationStatus}
        displayStatus={application.displayStatus}
        setApplicationStatus={jest.fn()}
      />
    );
    expect(r.find('Bootstrap(DropdownToggle)').text()).toBe('pending');
  });
});