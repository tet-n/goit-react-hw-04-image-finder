import img from 'components/ErrorMessage/error.gif';
import css from 'components/ErrorMessage/ErrorMessage.module.css';

export const ErrorMessage = ({ error }) => {
  return (
    <>
      <img className={css.Img} src={img} alt="Error" />
      <p className={css.Text}>
        Something went wrong. {error}...Please try again
      </p>
    </>
  );
  //
};
