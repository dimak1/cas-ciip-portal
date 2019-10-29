import React, {useState, useEffect} from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import Form from '../Forms/Form';
import ApplicationWizardConfirmation from './ApplicationWizardConfirmation';

const getInitialAdminData = application => {
  if (!application.swrsOrganisationData) return undefined;
  const {
    operatorName,
    operatorTradeName,
    duns,
    operatorMailingAddress,
    operatorCity,
    operatorProvince,
    operatorPostalCode,
    operatorCountry
  } = application.swrsOrganisationData;
  const {
    facilityName,
    facilityType,
    bcghgid,
    naicsCode,
    latitude,
    longitude,
    facilityMailingAddress,
    facilityCity,
    facilityProvince,
    facilityPostalCode
  } = application.swrsFacilityData;

  const {
    firstName,
    lastName,
    positionTitle,
    email,
    telephone,
    fax,
    contactMailingAddress,
    contactCity,
    contactProvince,
    contactPostalCode
  } = application.swrsOperatorContactData;

  return {
    reportingOperationInformation: [
      {
        operatorName,
        operatorTradeName,
        duns,
        naicsCode,
        mailingAddress: operatorMailingAddress,
        mailingAddressCity: operatorCity,
        mailingAddressProvince: operatorProvince,
        // TODOx: the postal code field in the survey should remove spaces when validating/submitting
        mailingAddressPostalCode: operatorPostalCode.replace(' ', ''),
        mailingAddressCountry: operatorCountry
      }
    ],
    facilityInformation: [
      {
        facilityName,
        facilityType,
        bcghgid,
        naicsCode,
        latitude,
        longitude,
        mailingAddress: facilityMailingAddress,
        mailingAddressCity: facilityCity,
        mailingAddressProvince: facilityProvince,
        mailingAddressPostalCode: facilityPostalCode.replace(' ', '')
      }
    ],
    operationalRepresentativeInformation: [
      {
        firstName,
        lastName,
        position: positionTitle,
        emailAddress: email,
        phone: telephone,
        fax,
        mailingAddress: contactMailingAddress,
        mailingAddressCity: contactCity,
        mailingAddressProvince: contactProvince,
        mailingAddressPostalCode: contactPostalCode.replace(' ', '')
      }
    ]
  };
};

const getInitialEmissionData = application => {
  const initialData = {};
  if (!application.swrsEmissionData) return undefined;
  for (const {
    node: {quantity, emissionCategory, gasType}
  } of application.swrsEmissionData.edges) {
    initialData[emissionCategory] = [
      {
        ...(initialData[emissionCategory] && initialData[emissionCategory][0]),
        [gasType]: [
          {
            annualEmission: quantity
          }
        ]
      }
    ];
  }

  return initialData;
};

const getInitialFuelData = (application, allFuels) => {
  if (!application.swrsFuelData) return undefined;
  return {
    fuels: application.swrsFuelData.edges.map(edge => {
      const {
        fuelType,
        fuelDescription,
        annualFuelAmount,
        alternativeMethodolodyDescription
      } = edge.node;
      const fuelNode = allFuels.edges.find(
        ({node: {name}}) => name === fuelType
      );
      const fuelUnits = fuelNode ? fuelNode.node.units : undefined;
      if (!fuelUnits)
        console.warn(`Could not find fuel with type "${fuelType}"`);
      return {
        fuelType,
        fuelUnits,
        description: fuelDescription,
        quantity: annualFuelAmount,
        methodology: alternativeMethodolodyDescription
      };
    })
  };
};

/*
 * The ApplicationWizardStep renders a form and, where applicable,
 *  TODOx: starts by presenting a summary of existing data to the user
 */
const ApplicationWizardStep = ({
  query,
  formName,
  onStepComplete,
  prepopulateFromSwrs,
  confirmationPage,
  formJsonRowId
}) => {
  const {application, allFuels} = query;
  const [initialData, setInitialData] = useState(undefined);

  useEffect(() => {
    if (
      application.formResultsByApplicationId.edges[formJsonRowId - 1].node
        .formResult !== '{}'
    ) {
      prepopulateFromSwrs = false;
      return setInitialData(
        JSON.parse(
          application.formResultsByApplicationId.edges[formJsonRowId - 1].node
            .formResult
        )
      );
    }

    if (!prepopulateFromSwrs) return setInitialData(undefined);
    switch (formName) {
      case 'Admin': {
        setInitialData(getInitialAdminData(application));
        break;
      }

      case 'Emission': {
        setInitialData(getInitialEmissionData(application));
        break;
      }

      case 'Fuel': {
        setInitialData(getInitialFuelData(application, allFuels));
        break;
      }

      default:
        setInitialData(undefined);
    }
  }, [
    formName,
    query,
    prepopulateFromSwrs,
    application,
    allFuels,
    formJsonRowId
  ]);

  let initialDataSource;
  if (
    application.formResultsByApplicationId.edges[formJsonRowId - 1].node
      .formResult !== '{}'
  ) {
    initialDataSource = 'your draft submission';
  } else if (prepopulateFromSwrs) {
    initialDataSource = 'your last SWRS report';
  }

  if (!application) return null;

  if (confirmationPage) return <ApplicationWizardConfirmation query={query} />;

  return (
    <Form
      query={query}
      formResultId={
        application.formResultsByApplicationId.edges[formJsonRowId - 1].node.id
      }
      startsEditable={!prepopulateFromSwrs}
      initialData={initialData}
      initialDataSource={initialDataSource}
      prepopulateFromSwrs={prepopulateFromSwrs}
      onFormComplete={onStepComplete}
    />
  );
};

export default createFragmentContainer(ApplicationWizardStep, {
  query: graphql`
    fragment ApplicationWizardStep_query on Query
      @argumentDefinitions(
        formId: {type: "ID!"}
        applicationId: {type: "ID!"}
      ) {
      ...Form_query @arguments(formId: $formId)
      ...ApplicationWizardConfirmation_query
        @arguments(applicationId: $applicationId)
      allFuels {
        edges {
          node {
            name
            units
          }
        }
      }
      application(id: $applicationId) {
        formResultsByApplicationId {
          edges {
            node {
              id
              formResult
            }
          }
        }
        swrsEmissionData(reportingYear: "2018") {
          edges {
            node {
              quantity
              emissionCategory
              gasType
            }
          }
        }
        swrsFacilityData(reportingYear: "2018") {
          facilityName
          facilityType
          bcghgid
          naicsCode
          latitude
          longitude
          facilityMailingAddress
          facilityCity
          facilityProvince
          facilityPostalCode
        }
        swrsFuelData(reportingYear: "2018") {
          edges {
            node {
              fuelType
              fuelDescription
              annualFuelAmount
              alternativeMethodolodyDescription
            }
          }
        }
        swrsOperatorContactData(reportingYear: "2018") {
          firstName
          lastName
          positionTitle
          email
          telephone
          fax
          contactMailingAddress
          contactCity
          contactProvince
          contactPostalCode
        }
        swrsOrganisationData(reportingYear: "2018") {
          operatorName
          operatorTradeName
          duns
          operatorMailingAddress
          operatorCity
          operatorProvince
          operatorPostalCode
          operatorCountry
        }
      }
    }
  `
});
