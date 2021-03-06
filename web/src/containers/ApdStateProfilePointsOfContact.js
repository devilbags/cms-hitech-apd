import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import {
  addPointOfContact,
  removePointOfContact,
  updateApd as updateApdAction
} from '../actions/apd';
import Btn from '../components/Btn';
import DeleteButton from '../components/DeleteConfirm';
import { Input } from '../components/Inputs';
import { t } from '../i18n';

class ApdStateProfile extends Component {
  handleChange = (field, index) => e => {
    const { updateApd } = this.props;
    updateApd({
      pointsOfContact: { [index]: { [field]: e.target.value } }
    });
  };

  render() {
    const {
      addPointOfContact: addPoc,
      poc,
      removePointOfContact: removePoc
    } = this.props;
    const tRoot = 'apd.stateProfile.pointsOfContact';

    return (
      <Fragment>
        {poc.map((person, i) => (
          <div key={i} className="mb3">
            <h3>Contact #{i + 1}</h3>
            <Input
              name={`apd-state-profile-pocname${i}`}
              label={t(`${tRoot}.labels.name`)}
              value={person.name}
              onChange={this.handleChange('name', i)}
            />
            <Input
              name={`apd-state-profile-pocposition${i}`}
              label={t(`${tRoot}.labels.position`)}
              value={person.position}
              onChange={this.handleChange('position', i)}
            />
            <Input
              name={`apd-state-profile-pocemail${i}`}
              label={t(`${tRoot}.labels.email`)}
              value={person.email}
              onChange={this.handleChange('email', i)}
            />
            <DeleteButton
              kind="outline"
              extraCss="blue h5"
              remove={() => removePoc(i)}
              resource={`${tRoot}.delete`}
            />
          </div>
        ))}
        <Btn onClick={addPoc}>
          {t('apd.stateProfile.pointsOfContact.labels.addButton', {
            count: poc.length
          })}
        </Btn>
      </Fragment>
    );
  }
}

ApdStateProfile.propTypes = {
  addPointOfContact: PropTypes.func.isRequired,
  poc: PropTypes.array.isRequired,
  removePointOfContact: PropTypes.func.isRequired,
  updateApd: PropTypes.func.isRequired
};

const mapStateToProps = ({ apd: { data: { pointsOfContact } } }) => ({
  poc: pointsOfContact
});
const mapDispatchToProps = {
  addPointOfContact,
  updateApd: updateApdAction,
  removePointOfContact
};

export default connect(mapStateToProps, mapDispatchToProps)(ApdStateProfile);
