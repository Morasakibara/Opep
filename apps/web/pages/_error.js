function Error({ statusCode }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'system-ui, sans-serif',
      background: '#0a0a0f',
      color: '#e4e4e7',
    }}>
      <h1 style={{ fontSize: '6rem', fontWeight: 900, margin: 0, color: '#6366f1' }}>
        {statusCode || 500}
      </h1>
      <p style={{ fontSize: '1.25rem', marginTop: '8px', color: '#a1a1aa' }}>
        {statusCode === 404
          ? 'Page non trouvée'
          : 'Une erreur est survenue'}
      </p>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
