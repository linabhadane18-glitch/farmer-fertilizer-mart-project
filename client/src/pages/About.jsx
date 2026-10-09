const About = () => (
  <>
    <div className="page-banner">
      <div className="container">
        <h1 className="page-title">About Farmers Fertilizer Mart</h1>
        <p className="page-sub">Helping farmers grow better with trusted supplies and clear guidance.</p>
      </div>
    </div>
    <div className="container" style={{ padding: '2rem 0 3rem', maxWidth: 800 }}>
      <p style={{ marginBottom: '1rem', fontSize: '1.05rem' }}>
        Farmers Fertilizer Mart is a smart agriculture e-commerce platform built for Indian
        farmers who need fertilizers, seeds, tools, and crop-care products without complicated
        shopping experiences.
      </p>
      <p style={{ marginBottom: '1rem' }}>
        We combine an easy online store with practical weather information and agricultural
        blogs so you can plan purchases and field work with more confidence.
      </p>
      <div className="grid-2" style={{ marginTop: '2rem' }}>
        <div className="benefit-item">
          <h3>Our Mission</h3>
          <p>
            Make quality farm inputs easier to find, understand, and order—especially for
            growers who prefer simple, mobile-friendly tools.
          </p>
        </div>
        <div className="benefit-item">
          <h3>Our Promise</h3>
          <p>
            Honest product information, careful stock handling, and clear safety notes on
            crop-protection items.
          </p>
        </div>
      </div>
    </div>
  </>
);

export default About;
