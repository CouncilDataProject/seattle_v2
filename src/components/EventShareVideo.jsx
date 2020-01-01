import React, { forwardRef, Fragment, useReducer, useRef, useState } from 'react';
import { Button, Form, Icon, Input, Modal, Ref } from 'semantic-ui-react';
import { useLocation } from 'react-router-dom';
import styled from '@emotion/styled';

const TimePointInput = styled(Input)(props => ({
  // add black line below time point input
  borderBottomColor: props.disabled ? 'white' : 'black',
  borderBottomStyle: 'solid',
  borderBottomWidth: '1.5px',
  width: '10em'
}));

const ShareVideoModal = styled(Modal)({
  // move close icon inside modal
  'i.close': {
    top: '0 !important',
    right: '0 !important',
    color: 'black !important'
  }
});

const ButtonWithRef = forwardRef((props, ref) => (
  // Forward a React reference into a button.
  // Needed in order to provide additional styling to share button,
  // that serves as a trigger to open a modal
  <Ref innerRef={ref}>
    <Button {...props} />
  </Ref>
));

const ShareButton = styled(ButtonWithRef)({
  backgroundColor: 'white !important',
  'i.share': {
    // Increase the distance share icon and share text
    paddingRight: '1.5em'
  }
});

// In anticipation of other buttons to be added next to share button, 
// make this inline-block so that they all appear on the same horizontal line.
const ModalMountNode = styled.div({
  display: 'inline-block'
});

/**
 * 
 * @param {string} timePointStr The str representation of a time point. e.g. 1:23:15
 * @return {(int|NaN)} The time point in total seconds. Or NaN, if the str contains
 * any non-digits.
 */
const toSeconds = (timePointStr) => {
  const nums = timePointStr.trim().split(':').reverse();
  let totalSeconds = 0;
  nums.forEach((num, i) => {
    num = num.trim();
    if (num) {
      if (isNaN(num) || num.includes('-')) {
        // num is not a number, or is negative
        totalSeconds += NaN;
      } else {
        totalSeconds += parseFloat(num) * Math.pow(60, i);
      }
    }
  });
  if (totalSeconds) {
    totalSeconds = Math.floor(totalSeconds);
  }
  return totalSeconds;
};

/**
 * 
 * @param {(int|NaN)} totalSeconds The total number of seconds of a time point.
 * @return {string} The time point str. e.g. 1:23:15, or `INVALID TIME POINT` if totalSeconds is not a number.
 */
const toTimePointStr = (totalSeconds) => {
  if (isNaN(totalSeconds)) {
    return 'INVALID TIME POINT';
  }

  totalSeconds = Math.floor(parseFloat(totalSeconds));

  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
  let seconds = totalSeconds - (hours * 3600) - (minutes * 60);

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  if (hours > 0 && minutes < 10) {
    minutes = `0${minutes}`;
  }

  let timePointStr = `${minutes}:${seconds}`;
  if (hours) {
    timePointStr = `${hours}:${timePointStr}`;
  }

  return timePointStr;
};

const initialTimePoint = {
  // The time point str
  value: '',
  // Whether the user can enter a value to the time point input html element
  isDisabled: false,
  // Whether value(in seconds) is added to the share link url
  isActive: false
};

/**
 * 
 * @param {Object} timePoint The time point state.
 * @param {string} timePoint.value
 * @param {boolean} timePoint.isDisabled
 * @param {boolean} timePoint.isActive
 * @param {Object} action The action to change the time point state.
 * @param {string} action.type The str description of the action.
 * @param {Object} [action.payload] The action's data.
 * @return {Object} New time point state.
 */
const timePointReducer = (timePoint, action) => {
  switch (action.type) {
    case 'UPDATE_VALUE':
      return { ...timePoint, value: action.payload.value };
    case 'VALIDATE_VALUE':
      const newValue = toTimePointStr(toSeconds(timePoint.value));
      return { ...timePoint, value: newValue };
    case 'UPDATE_ISDISABLED':
      return { ...timePoint, isDisabled: action.payload.isDisabled };
    case 'UPDATE_ISACTIVE':
      return { ...timePoint, isActive: action.payload.isActive };
    default:
      return timePoint;
  }
};

const EventShareVideo = ({
  videoPlayerRef
}) => {
  // A reference to the html element where the modal is mounted
  const mountNodeRef = useRef();
  // A reference to the share link url html element
  const shareLinkRef = useRef();
  // A reference to the time point input html element
  const timePointRef = useRef();
  // Get the location object that represents the current URL
  const location = useLocation();
  // open is a React state, whether the modal is open. setOpen is the function to update open
  const [open, setOpen] = useState(false);
  // timePoint is a React state. dispatch function is used to send an action to timePointReducer
  // to change the timePoint state
  const [timePoint, dispatch] = useReducer(timePointReducer, initialTimePoint);

  // Callback to handle opening of modal
  const handleOpen = () => {
    let currentTime;
    if (videoPlayerRef.current) {
      const { player } = videoPlayerRef.current.getState();
      currentTime = player.readyState === 4 ? player.currentTime : 0;
    } else {
      currentTime = 0;
    }
    // initially, the time point value is the video's current time
    dispatch({ type: 'UPDATE_VALUE', payload: { value: toTimePointStr(currentTime) } });
    // initially, the user can enter a value for the time point input html element
    dispatch({ type: 'UPDATE_ISDISABLED', payload: { isDisabled: false } });
    // initially, the time point value(in seconds) is not added to the share link url
    dispatch({ type: 'UPDATE_ISACTIVE', payload: { isActive: false } });
    setOpen(true);
  };

  // Callback to handle closing of modal
  const handleClose = () => {
    timePointRef.current.inputRef.current.removeEventListener('blur', validateTimePointCb);
    setOpen(false);
  };

  // Callback to handle `Start at` checkbox changes
  const onTimePointIsActiveChange = (e, { checked }) => {
    dispatch({ type: 'VALIDATE_VALUE' });
    dispatch({ type: 'UPDATE_ISDISABLED', payload: { isDisabled: !checked } });
    dispatch({ type: 'UPDATE_ISACTIVE', payload: { isActive: checked } });
  };

  // Callback to handle copy share link url button click
  const onCopyShareLink = () => {
    // select the content of shareLinkRef, which is the share link url
    shareLinkRef.current.select();
    // copy the content to the clipboard
    document.execCommand('copy');
  };

  // Get the share link url
  const getVideoShareLink = () => {
    let totalSeconds = toSeconds(timePoint.value);
    let videoShareLink = `${document.location.origin}/#${location.pathname}`;
    return (timePoint.isActive && totalSeconds) ?
      `${videoShareLink}?t=${totalSeconds}` :
      `${videoShareLink}`;
  };

  // Callback to handle time point value changes
  const onTimePointValueChange = (e, { value }) => {
    dispatch({ type: 'UPDATE_VALUE', payload: { value: value } });
  };

  // Callback to handle when the user press enter while the time point input html element is in focus,
  // or when the time point input html element becomes out of focus
  const validateTimePointCb = () => {
    dispatch({ type: 'VALIDATE_VALUE' });
  };

  // Callback to handle when the modal is mounted
  const onModalMount = () => {
    // Add an event listener for when the time point input html element becomes out of focus
    timePointRef.current.inputRef.current.addEventListener('blur', validateTimePointCb);
  };

  return (
    <Fragment>
      <ShareVideoModal
        closeIcon
        trigger={
          <ShareButton compact icon onClick={handleOpen}>
            <Icon name='share' />
            SHARE
          </ShareButton>
        }
        open={open}
        onClose={handleClose}
        mountNode={mountNodeRef.current}
        onMount={onModalMount}
        size='small'
      >
        <Modal.Header>Share</Modal.Header>
        <Modal.Content>
          <Input
            fluid
            action={<Button primary content='Copy' onClick={onCopyShareLink} />}
            ref={shareLinkRef}
            value={getVideoShareLink()} />
          <br />
          <Form onSubmit={validateTimePointCb}>
            <Form.Group>
              <Form.Checkbox
                label={`Start at`}
                checked={timePoint.isActive}
                onChange={onTimePointIsActiveChange} />
              <TimePointInput
                disabled={timePoint.isDisabled}
                transparent
                value={timePoint.value}
                onChange={onTimePointValueChange}
                ref={timePointRef} />
            </Form.Group>
          </Form>
        </Modal.Content>
      </ShareVideoModal>
      <ModalMountNode ref={mountNodeRef} />
    </Fragment>
  );
};

export default EventShareVideo;