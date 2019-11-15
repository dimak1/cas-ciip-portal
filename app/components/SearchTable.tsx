import {Component} from 'react';

interface Props {
  query;
  defaultOrderByField: string;
  defaultOrderByDisplay: string;
  children: (props) => JSX.Element;
}
class SearchTableComponent extends Component<Props> {
  state = {
    orderByField: this.props.defaultOrderByField,
    orderByDisplay: this.props.defaultOrderByDisplay,
    direction: 'ASC',
    searchField: null,
    searchValue: null,
    searchDisplay: 'No Filter'
  };

  toggleDirection = () => {
    this.state.direction === 'ASC'
      ? this.setState({direction: 'DESC'})
      : this.setState({direction: 'ASC'});
  };

  sortApplications = (event, eventKey) => {
    this.setState({
      orderByField: eventKey,
      orderByDisplay: event.target.text
    });
  };

  applySearchField = (event, eventKey) => {
    this.setState({
      searchField: eventKey,
      searchDisplay: event.target.text,
      searchValue: null
    });
  };

  applySearchValue = event => {
    if (this.state.searchField !== 'none') {
      this.setState({searchValue: event.nativeEvent.target[0].value});
    }
  };

  handleEvent = (event, eventKey) => {
    event.preventDefault();
    event.stopPropagation();
    event.persist();
    this[event.target.id](event, eventKey);
  };

  render() {
    const {query} = this.props;
    const {children} = this.props;

    return children({
      query,
      orderByDisplay: this.state.orderByDisplay,
      orderByField: this.state.orderByField,
      direction: this.state.direction,
      searchField: this.state.searchField,
      searchValue: this.state.searchValue,
      searchDisplay: this.state.searchDisplay,
      handleEvent: this.handleEvent
    });
  }
}

export default SearchTableComponent;