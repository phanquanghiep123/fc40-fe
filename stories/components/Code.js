import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yLight } from 'react-syntax-highlighter/dist/styles/hljs';

const Code = ({ title, ...props }) => (
  <ExpansionPanel style={{ marginTop: 20 }}>
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="h6">{title}</Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <SyntaxHighlighter
        {...props}
        style={a11yLight}
        showLineNumbers
        customStyle={{ width: '100%', margin: 0 }}
      />
    </ExpansionPanelDetails>
  </ExpansionPanel>
);

Code.propTypes = {
  title: PropTypes.string,
};

Code.defaultProps = {
  title: 'Example Code',
};

export default Code;
