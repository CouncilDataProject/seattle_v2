import React from 'react';
import { Button, Header, Icon, Popup } from 'semantic-ui-react';
import styled from '@emotion/styled';

const ButtonContainer = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '1em 0'
});

const StyledPopup = styled(Popup)({
  minWidth: '250px !important',
  maxWidth: '90% !important',
  boxShadow: 'none !important',
  '@media(max-width:500px)': {
    width: '86% !important'
  }
});

const ContentContainer = styled(Popup.Content)({
  flexGrow: '1',
  overflowY: 'auto !important',
});

const PopupContainer = styled.div({
  maxHeight: '45vh',
  display: 'flex',
  flexDirection: 'column'
});

const FilterPopup = ({
  filter,
  header,
  handlePopupClose,
  mountNodeRef,
  children
}) => {
  const { clear, getTextRep, isActive } = filter;
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    handlePopupClose();
  };

  const handleClear = () => {
    clear();
  };

  return (
    <StyledPopup
      basic
      flowing
      mountNode={mountNodeRef.current}
      on='click'
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      pinned={true}
      offset='0, -5px'
      position='bottom left'
      positionFixed={true}
      trigger={
        <Button
          icon
          labelPosition='right'
          basic={!isActive()}>
          <Icon name='angle down' />
          {getTextRep()}
        </Button>}
    >
    <PopupContainer>
      <Header content={header} />
      <ContentContainer>
        {children}
      </ContentContainer>
      <ButtonContainer >
        <Button size='mini' onClick={handleClear}>
          <Icon name='remove' /> Clear
        </Button>
        <Button size='mini' primary onClick={handleClose}>
          <Icon name='checkmark' /> Save
        </Button>
      </ButtonContainer>
    </PopupContainer>
    </StyledPopup>
  );
};

export default React.memo(FilterPopup);