export interface BALWidgetLink {
  label: string;
  url: string;
}

export interface BALWidgetConfig {
  global: {
    title: string;
    hideWidget: boolean;
    showOnPages: string[];
  };
  gitbook: {
    welcomeBlockTitle: string;
    topArticles: BALWidgetLink[];
  };
  contactUs: {
    welcomeBlockTitle: string;
    subjects: string[];
  };
}
