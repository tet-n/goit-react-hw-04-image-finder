import { Formik, Form, Field, ErrorMessage } from 'formik';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import css from './Searchbar.module.css';

const schema = yup.object().shape({
  name: yup
    .string()
    .min(2, '*It is too short. It must contain more than 1 letter'),
});

const initialValues = {
  name: '',
};

export const Searchbar = ({ getName }) => {
  const handleSubmit = (values, { resetForm }) => {
    getName(values.name.trim());
    resetForm();
  };

  return (
    <header className={css.Searchbar}>
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={schema}
      >
        <Form className={css['SearchForm']} autoComplete="off" autoFocus>
          <button type="submit" className={css['SearchForm-button']}>
            <span className={css['SearchForm-button-label']}>Search</span>
          </button>
          <div className={css.Wrapper}>
            <Field
              className={css['SearchForm-input']}
              type="text"
              placeholder="Search images and photos"
              name="name"
            />
            <ErrorMessage name="name" component="div" className={css.NoValid} />
          </div>
        </Form>
      </Formik>
    </header>
  );
};

Searchbar.propTypes = {
  getName: PropTypes.func.isRequired,
};
