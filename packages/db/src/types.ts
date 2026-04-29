export type GeneratedFeature = {
  title: string;
  description: string;
};

export type GeneratedPricing = {
  label: string;
  price: string;
  note: string;
};

export type GeneratedCta = {
  text: string;
  subText: string;
};

export type GeneratedContent = {
  headline: string;
  subHeadline: string;
  productDescription: string;
  benefits: string[];
  features: GeneratedFeature[];
  socialProof: string;
  pricing: GeneratedPricing;
  cta: GeneratedCta;
};
