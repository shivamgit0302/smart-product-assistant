import { Helmet } from "react-helmet";

function MetaTags({ title, description }) {
  const defaultTitle = "Smart Product Assistant | AI-Powered Product Search";
  const defaultDescription =
    "Find exactly what you need using AI-powered search. Describe what you're looking for in your own words and get personalized product recommendations.";

  return (
    <Helmet>
      <title>{title || defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta property="og:title" content={title || defaultTitle} />
      <meta
        property="og:description"
        content={description || defaultDescription}
      />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || defaultTitle} />
      <meta
        name="twitter:description"
        content={description || defaultDescription}
      />
    </Helmet>
  );
}

export default MetaTags;
