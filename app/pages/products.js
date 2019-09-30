import React, {Component} from 'react';
<<<<<<< c124945ecf29134c02c925d5058c72750356840d
import {Container, Row, Col, Jumbotron} from 'react-bootstrap';
import Header from '../components/Header';
import ProductCreator from '../components/Products/ProductCreator';
import ProductList from '../components/Products/ProductList';

class Admin extends Component {
  state = {
    formData: {formId: '', formJson: ''}
  };

  formIdHandler = (formId, formJson) => {
    this.setState({formData: {formId, formJson}});
    console.log('form-builder.js > formIdHandler state', this.state);
  };
=======
import {graphql} from 'react-relay';
import ProductList from '../components/Products/ProductList';

export default class Products extends Component {
  static query = graphql`
    query productsQuery {
      query {
        ...ProductList_query
      }
    }
  `;
>>>>>>> wip: example use of singleton environment and fragments

  render() {
    const {query} = this.props;
    return (
      <>
<<<<<<< c124945ecf29134c02c925d5058c72750356840d
        <Header />
        <Container>
          <Row>
            <Col>
              <h3>Products and Benchmarks</h3>
              <br />
              <Jumbotron>
                <h4>Create a Product</h4>
                <br />
                <ProductCreator />
              </Jumbotron>
              <br />
              <br />
              <br />
              <ProductList />
            </Col>
          </Row>
        </Container>
=======
        <h1>Products</h1>
        <ProductList query={query} />
>>>>>>> wip: example use of singleton environment and fragments
      </>
    );
  }
}
<<<<<<< c124945ecf29134c02c925d5058c72750356840d

export default Admin;

/*

Product Creator:
1: Add table for product (name and description)
2: Add component for createproduct
3: Add add fields for create product in component: Product name and description
4: On save create object and push to createProduct mutation

List of products
1: create component for List of Products
2: use queryrenderer to loop through products
3: display products as a list

BM and ET
1: Create a component for BM and ET
2: Pass product object to the component
3: Component has prdouct name, description, BM and ET fields and a save button
4: on save create update BM/ET Values: Todo: Add history in the future
5: Update the components

 */
=======
>>>>>>> wip: example use of singleton environment and fragments
