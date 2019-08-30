import React ,{ Component } from 'react'
import ReactDOM from 'react-dom';
import {graphql, QueryRenderer} from "react-relay";
import initEnvironment from '../../lib/createRelayEnvironment';
import ApplicationRowItem from "./ApplicationRowItem";
import {Container, Dropdown, Button, Row, Col, Form} from 'react-bootstrap';
const environment = initEnvironment();

// TODO: Dynamic options for filtering (ie: dropdown for status?), filtering with contains etc instead of just equals

class ApplicationList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orderByField: "OPERATOR_NAME_",
            direction: "ASC",
            orderByDisplay: "Operator Name",
            filterField: "none",
            filterValue: null,
            filterDisplay: "No Filter"
        }
    }

    listApplications = ({error, props}) => {
        console.log('ApplicationList.js > listApplications()', props, error);
        const applicationList = [];
        if(props){
            const allApplications = props.allApplications.nodes;
            allApplications.forEach((application) => {
                applicationList.push(<ApplicationRowItem application={application} />);
            })
        }
        return applicationList;
    }

    sortApplications = (eventKey, event) => {
        event.preventDefault();
        event.stopPropagation();
        event.persist();
        this.setState({orderByField: eventKey, orderByDisplay: event.target.text});
    }

    toggleDirection = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.state.direction === 'ASC' ? this.setState({direction: 'DESC'}) : this.setState({direction: 'ASC'})
    }

    applyFilterField = (eventKey, event) => {
        event.preventDefault();
        event.stopPropagation();
        event.persist();
        this.setState({filterField: eventKey, filterDisplay: event.target.text, filterValue: null});
    }

    applyFilterValue = (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.persist();
        if (this.state.filterField !== "none") {
            this.setState({filterValue: event.target[0].value});
        }
    }

    render(){
        let vars;
        if (this.state.filterField !== 'none' && this.state.filterValue !== null) {
           vars = {condition: { [this.state.filterField]: this.state.filterValue }, orderBy: `${this.state.orderByField}${this.state.direction}`};
        } else {
           vars = {orderBy: `${this.state.orderByField}${this.state.direction}`};
        }
        return(
            <React.Fragment>
                <Container style={{padding: 10, background: 'lightGrey'}}>
                    <Row>
                        <Col md={2}>
                        <h5>Sort Applications</h5>
                        </Col>
                        <Col md={2}/>
                        <Col md={3}>
                            <h5>Filter Applications</h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={2}>
                            <Dropdown style={{width: "100%"}}>
                                <Dropdown.Toggle style={{width: "100%"}} variant='info' id='dropdown-sort'>
                                    {this.state.orderByDisplay}
                                </Dropdown.Toggle>
                                    <Dropdown.Menu style={{width: "100%"}}>
                                        <Dropdown.Item eventKey='APPLICATION_ID_' onSelect={this.sortApplications}>Application ID</Dropdown.Item>
                                        <Dropdown.Item eventKey='OPERATOR_NAME_' onSelect={this.sortApplications}>Operator Name</Dropdown.Item>
                                        <Dropdown.Item eventKey='FACILITY_NAME_' onSelect={this.sortApplications}>Facility Name</Dropdown.Item>
                                        <Dropdown.Item eventKey='CERTIFICATION_DATE_' onSelect={this.sortApplications}>Submission Date</Dropdown.Item>
                                        <Dropdown.Item eventKey='APPLICATION_STATUS_' onSelect={this.sortApplications}>Status</Dropdown.Item>
                                    </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col md={1}>
                            <Button style={{width: "100%"}}onClick={this.toggleDirection} variant='info'>{this.state.direction}</Button>
                        </Col>
                        <Col md={1}/>
                        <Col md={2}>
                           <Dropdown style={{width: "100%"}}>
                                <Dropdown.Toggle style={{width: "100%"}} variant='info' id='dropdown-filter'>
                                    {this.state.filterDisplay}
                                </Dropdown.Toggle>
                                    <Dropdown.Menu style={{width: "100%"}}>
                                        <Dropdown.Item eventKey='none' onSelect={this.applyFilterField}>No Filter</Dropdown.Item>
                                        <Dropdown.Item eventKey='applicationId' onSelect={this.applyFilterField}>Application ID</Dropdown.Item>
                                        <Dropdown.Item eventKey='operatorName' onSelect={this.applyFilterField}>Operator Name</Dropdown.Item>
                                        <Dropdown.Item eventKey='facilityName' onSelect={this.applyFilterField}>Facility Name</Dropdown.Item>
                                        <Dropdown.Item eventKey='certificationDate' onSelect={this.applyFilterField}>Submission Date</Dropdown.Item>
                                        <Dropdown.Item eventKey='applicationStatus' onSelect={this.applyFilterField}>Status</Dropdown.Item>
                                    </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col md={6}>
                        <Form onSubmit={this.applyFilterValue}>
                          <Form.Row>
                            <Form.Group as={Col} md={8} controlId="filter">
                                <Form.Control type="string" step="0.01"
                                              ref='filter' />
                            </Form.Group>
                            <Form.Group as={Col} md={1}>
                                <Button variant='info' type='submit'>Filter</Button>
                            </Form.Group>
                            </Form.Row>
                        </Form>
                        </Col>
                    </Row>
                </Container>
                <br/>
                <br/>
                <QueryRenderer
                    environment={environment}
                    variables={vars}
                    query={graphql`
                        query ApplicationListQuery($condition: ApplicationCondition, $orderBy: [ApplicationsOrderBy!]) {
                            allApplications(condition: $condition, orderBy: $orderBy){
                                nodes{
                                  applicationId
                                  facilityName
                                  operatorName
                                  applicationStatus
                                  certificationDate
                                }
                            }
                        }
                    `}

                    render={this.listApplications}
                />
          </React.Fragment>
        )
    }
}

export default ApplicationList;
