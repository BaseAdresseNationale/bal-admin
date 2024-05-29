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
  communes: {
    welcomeBlockTitle: string;
    outdatedApiDepotClients: string[];
    outdatedHarvestSources: string[];
  };
  contactUs: {
    welcomeBlockTitle: string;
    subjects: string[];
  };
  gitbookCommunes: {
    welcomeBlockTitle: string;
    topArticles: BALWidgetLink[];
  };
  gitbookParticuliers: {
    welcomeBlockTitle: string;
    topArticles: BALWidgetLink[];
  };
}
