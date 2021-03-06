import React from 'react';
import MathJax from 'react-mathjax2';
import {Row, Col} from 'react-bootstrap';

const IncentiveSegmentFormula = () => {
  const formula = `
            \\left(Quantity - Benchmark
            \\over
            Eligibility Threshold - Benchmark \\right)
            \\times
           Attributable Fuel Percentage
            \\times
           Estimated Carbon Tax Paid

        `;
  return (
    <Row>
      <Col md={12}>
        <MathJax.Context input="tex">
          <div>
            <MathJax.Node>{formula}</MathJax.Node>
          </div>
        </MathJax.Context>
      </Col>
    </Row>
  );
};

export default IncentiveSegmentFormula;
