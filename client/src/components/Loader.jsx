const Loader = ({ message = 'Loading...' }) => (
  <div className="loader">
    <div className="spinner" aria-hidden="true" />
    <p>{message}</p>
  </div>
);

export default Loader;
