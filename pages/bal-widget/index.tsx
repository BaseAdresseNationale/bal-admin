import React, { useMemo, useState } from "react";
import { getBALWidgetConfig } from "../../lib/bal-widget";
import { BALWidgetConfig } from "../../types/bal-widget";
import { BALWidgetConfigForm } from "../../components/bal-widget/bal-widget-config-form";
import { setBALWidgetConfig } from "../../lib/bal-widget";
import { toast } from "react-toastify";
import BALWidgetIFrame from "@/components/bal-widget/bal-widget-iframe";

type BALWidgetPageProps = {
  config: BALWidgetConfig;
};

const defaultConfig: BALWidgetConfig = {
  global: {
    title: "Centre d'aide Base Adresse Locale",
    hideWidget: false,
    showOnPages: [],
  },
  communes: {
    welcomeBlockTitle: "Vous êtes une commune ?",
    outdatedApiDepotClients: [],
    outdatedHarvestSources: [],
  },
  gitbook: {
    welcomeBlockTitle: "Ces articles pourraient vous aider",
    topArticles: [],
  },
  contactUs: {
    welcomeBlockTitle: "Nous contacter",
    subjects: [],
  },
};

const BALWidgetPage = ({ config: baseConfig }: BALWidgetPageProps) => {
  const [config, setConfig] = useState<BALWidgetConfig>(baseConfig);
  const initialConfig = useMemo(
    () => (baseConfig ? { ...baseConfig } : { ...defaultConfig }),
    [baseConfig]
  );

  const [formData, setFormData] = useState<BALWidgetConfig>(initialConfig);
  const onSubmit = async (formData: BALWidgetConfig) => {
    try {
      const config = await setBALWidgetConfig(formData);
      toast("Configuration du widget mise à jour", { type: "success" });
      setConfig(config);
    } catch (error: unknown) {
      console.log(error);
      toast("Erreur lors de la mise à jour de la configuration du widget", {
        type: "error",
      });
    }
  };
  return (
    <div className="fr-container">
      <BALWidgetConfigForm
        baseConfig={config}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
      <BALWidgetIFrame config={formData} />
    </div>
  );
};

export async function getServerSideProps() {
  const config = await getBALWidgetConfig();

  return {
    props: {
      config,
    },
  };
}

export default BALWidgetPage;
