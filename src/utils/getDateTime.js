import moment from 'moment';

/*Always display PST/PDT for event_datetime, regardless of user's locale*/
const getDateTime = (date) => {
  return moment.utc(date).format('MMMM D, YYYY h:mm A');
};

export default getDateTime;