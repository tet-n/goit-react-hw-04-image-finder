import { TailSpin } from 'react-loader-spinner';
import PropTypes from 'prop-types';

export const Loader = ({ visible }) => {
  return (
    <TailSpin
      height="60"
      width="60"
      color="#232caa"
      ariaLabel="tail-spin-loading"
      radius="1"
      wrapperStyle={{ margin: '0 auto' }}
      visible={visible}
    />
  );
};

Loader.propTypes = {
  visible: PropTypes.bool.isRequired,
};
