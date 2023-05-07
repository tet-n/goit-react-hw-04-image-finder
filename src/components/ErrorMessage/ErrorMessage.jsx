import img from 'components/ErrorMessage/error.gif';
import css from 'components/ErrorMessage/ErrorMessage.module.css';

export const ErrorMessage = () => {
  return (
    <>
      <img className={css.Img} src={img} alt="Error" />
      <p className={css.Text}>Something went wrong...Please try again</p>
    </>
  );
};
