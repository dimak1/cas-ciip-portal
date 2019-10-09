import React from 'react';
import {render, waitForDomChange} from '@testing-library/react';
import ApplicationListContainer from '../../../containers/Applications/ApplicationListContainer';
import {queryMock} from '../../../lib/relayQueryMock';

let mockAppQueryData;

// TODO: The query mock should be done in pages now, look at how to test this after the relay refactor

// Describe('Application List', () => {
//   beforeEach(() => {
//     // Make sure mock data is always fresh for each test run
//     mockAppQueryData = {
//       searchApplicationListContainer: {
//         nodes: [
//           {
//             applicationId: 1,
//             facilityName: 'facility1',
//             operatorName: 'operator1',
//             applicationStatus: 'approved',
//             submissionDate: 'Sun, 17 Dec 1995 03:24:00 GMT',
//             bcghgid: '1',
//             reportingYear: '2018'
//           },
//           {
//             applicationId: 2,
//             facilityName: 'facility2',
//             operatorName: 'operator2',
//             applicationStatus: 'pending',
//             submissionDate: 'Fri, 11 May 2018 02:21:00 GMT',
//             bcghgid: '1',
//             reportingYear: '2018'
//           }
//         ]
//       }
//     };
//   });

//   it('should render all the applications', async () => {
//     queryMock.mockQuery({
//       name: 'ApplicationListSearchQuery',
//       data: mockAppQueryData,
//       variables: {
//         searchField: null,
//         searchValue: null,
//         orderByField: 'operator_name',
//         direction: 'ASC'
//       }
//     });

//     const r = render(<ApplicationListContainer />);
//     await waitForDomChange(() => r.getAllByText('facility1', {exact: false}));
//     const elements = r.getAllByText(/facility\d/, {exact: false});
//     expect(r).toMatchSnapshot();
//     expect(elements.length).toBe(2);
//   });
// });