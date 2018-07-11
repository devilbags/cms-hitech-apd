import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';
import Waypoint from 'react-waypoint';

import Collapsible from './Collapsible';
import HelpText from './HelpText';
import SectionTitle from './SectionTitle';
import SectionDesc from './SectionDesc';
import { t } from '../i18n';

const ScrollWatcher = Wrapped =>
  withRouter(
    class extends Component {
      static propTypes = {
        id: PropTypes.string,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
      };

      static defaultProps = {
        id: null
      };

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
        if (!this.props.id) return <Wrapped {...this.props} />;

        return (
          <div>
            <Waypoint onEnter={this.handleEnter} onLeave={this.handleLeave} />
            <Wrapped {...this.props} />
          </div>
        );
      }
    }
  );

const Section = ({ children, id, resource }) => {
  const title = t([resource, 'title'], { defaultValue: false });
  const subheader = t([resource, 'subheader'], { defaultValue: false });
  const helptext = t([resource, 'helpText'], { defaultValue: false });

  return (
    <section id={id} className="py2 border-bottom border-grey border-width-3">
      {title && <SectionTitle>{title}</SectionTitle>}
      {subheader && <div>{subheader}</div>}
      {helptext && <SectionDesc>{helptext}</SectionDesc>}
      {children}
    </section>
  );
};

Section.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string,
  resource: PropTypes.string
};

Section.defaultProps = {
  id: null,
  resource: null
};

const Chunk = ({ children, resource }) => {
  const subheader = t([resource, 'subheader'], { defaultValue: false });

  return (
    <Fragment>
      {subheader && <div className="mb-tiny bold">{subheader}</div>}
      <HelpText
        text={`${resource}.helpText`}
        reminder={`${resource}.reminder`}
      />
      {children}
    </Fragment>
  );
};

Chunk.propTypes = {
  children: PropTypes.node.isRequired,
  resource: PropTypes.string
};

Chunk.defaultProps = {
  resource: null
};

const Subsection = ({ children, id, isKey, open, resource }) => {
  const title = t([resource, 'title'], { defaultValue: '' });

  return (
    <Collapsible id={id} title={`${isKey ? 'Key ' : ''}${title}`} open={open}>
      <Chunk resource={resource}>{children}</Chunk>
    </Collapsible>
  );
};

Subsection.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string,
  isKey: PropTypes.bool,
  open: PropTypes.bool,
  resource: PropTypes.string
};

Subsection.defaultProps = {
  resource: null,
  id: null,
  isKey: false,
  open: false
};

const ScrollSection = ScrollWatcher(Section);
const ScrollSubsection = ScrollWatcher(Subsection);

export default ScrollSection;
export { Chunk, ScrollSection as Section, ScrollSubsection as Subsection };
