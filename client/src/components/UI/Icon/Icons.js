import React from 'react';
import './index.scss';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const Icons = ({setContent, content}) => {
  const reactions = [
    '❤️', '😆', '😯', '😢', '😡', '👍', '👎', '😄',
    '😂', '😍', '😘', '😗', '😚', '😳', '😭', '😓',
    '😤', '🤤', '👻', '💀', '🤐', '😴', '😷', '😵'
  ];

    return (
        <div className="icons">
            <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>😄</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
              <div className="reactions">
                    {
                        reactions.map(icon => (
                            <span key={icon} onClick={() => setContent(content + icon)}>
                                {icon}
                            </span>
                        ))
                    }
                </div>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
    )
}

export default Icons;
