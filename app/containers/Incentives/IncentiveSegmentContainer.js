import React from 'react';
import {createFragmentContainer, graphql} from 'react-relay';
import MathJax from 'react-mathjax2';
import BenchmarkChart from '../../components/Incentives/BenchmarkChart';

const IncentiveSegmentContainer = props => {
  const {allProducts, reported, carbonTax} = props;
  const totalCarbonTax = carbonTax.edges.reduce((total, curr) => {
    return parseFloat(total) + parseFloat(curr.node.calculatedCarbonTax);
  }, 0);

  const productDetails = allProducts.edges.filter(
    ({node: p}) => p.name === reported.product
  );
  let benchmark = 0;
  let eligibilityThreshold = 0;
  let eligibilityValue = 0;
  let eligibleFuelValue = 0;

  if (productDetails.length > 0) {
    const productQuantity = parseFloat(reported.quantity);
    const attributableFuelPercentage = parseFloat(
      reported.attributableFuelPercentage
    );

    const details =
      productDetails[0].node.benchmarksByProductId.nodes[
        productDetails[0].node.benchmarksByProductId.nodes.length - 1
      ];
    benchmark = details ? details.benchmark : 0;
    eligibilityThreshold = details ? details.eligibilityThreshold : 0;

    // Todo: How do we deal with benchmarks and products not set in db.

    if (productQuantity > benchmark && productQuantity < eligibilityThreshold) {
      eligibilityValue =
        (productQuantity - benchmark) / (eligibilityThreshold - benchmark);
    }

    eligibleFuelValue = (attributableFuelPercentage / 100) * eligibilityValue;
  }

  const formula = `
      \\left(${reported.quantity} - ${benchmark}
      \\over
      ${eligibilityThreshold} - ${benchmark} \\right)
      \\times
      ${reported.attributableFuelPercentage}
      \\times
      ${totalCarbonTax.toFixed(2)}
  `;
  console.log('Incentive Segment details', reported.product, formula);

  return (
    <tr>
      <td>{reported.product}</td>
      <td>
        <MathJax.Context input="tex">
          <MathJax.Node>{formula}</MathJax.Node>
        </MathJax.Context>
      </td>
      <td>CAD {(eligibleFuelValue * totalCarbonTax).toFixed(2)} </td>
      <td>
        <BenchmarkChart
          quantity={Number(reported.quantity)}
          benchmark={benchmark}
          eligibilityThreshold={eligibilityThreshold}
        />
      </td>
      <style jsx>
        {`
          td {
            vertical-align: middle;
          }
        `}
      </style>
    </tr>
  );
};

export default createFragmentContainer(IncentiveSegmentContainer, {
  reported: graphql`
    fragment IncentiveSegmentContainer_reported on CiipProduction {
      rowId
      quantity
      product
      fuelUnits
      associatedEmissions
      attributableFuelPercentage
    }
  `
});

/*
Can fuel percentages be reported as null?
 */
