import React, { useState } from "react";
import { getBALWidgetConfig } from "../../lib/bal-widget";
import { BALWidgetConfig } from "../../types/bal-widget";
import { BALWidgetConfigForm } from "../../components/bal-widget/bal-widget-config-form";
import { setBALWidgetConfig } from "../../lib/bal-widget";
import { toast } from "react-toastify";

type BALWidgetPageProps = {
  config: BALWidgetConfig;
};

const BALWidgetPage = ({ config: baseConfig }: BALWidgetPageProps) => {
  const [config, setConfig] = useState<BALWidgetConfig>(baseConfig);
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
      <BALWidgetConfigForm config={config} onSubmit={onSubmit} />
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
