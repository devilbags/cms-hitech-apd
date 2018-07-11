import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Waypoint from 'react-waypoint';

class MyWaypoint extends Component {
  handleEnter = ({ currentPosition, previousPosition }) => {
    if (currentPosition === 'inside' && previousPosition === 'above') {
      this.updateUrl();
    }
  };

  handleLeave = ({ currentPosition, previousPosition }) => {
    if (currentPosition === 'above' && previousPosition === 'inside') {
      this.updateUrl();
    }
  };

  updateUrl = () => {
    const { id, location, history } = this.props;
    const newHash = `#${id}`;

    if (location.hash === newHash) return;
    history.replace(newHash);
  };

  render() {
    return <Waypoint onEnter={this.handleEnter} onLeave={this.handleLeave} />;
  }
}

MyWaypoint.propTypes = {
  id: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(MyWaypoint);
