import { useCallback, useEffect, useState } from "react";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { ToggleSwitch } from "@codegouvfr/react-dsfr/ToggleSwitch";
import { useRouter } from "next/router";

import {
  ClientApiDepotAuthorizationStrategyEnum,
  type ChefDeFileApiDepotType,
  type MandataireApiDepotType,
} from "types/api-depot";

import {
  createClient,
  updateClient,
  createMandataire,
  createChefDeFile,
  getChefsDeFile,
  getClient,
  getMandataires,
} from "@/lib/api-depot";
import Loader from "@/components/loader";
import SelectInput from "@/components/select-input";
import TextInput from "@/components/text-input";
import MandataireForm from "@/components/api-depot/client/client-form/mandataire-form";
import ChefDeFileSelect from "@/components/api-depot/client/client-form/chef-de-file-select";
import ChefDeFileForm from "@/components/api-depot/client/client-form/chef-de-file-form";

const authorizationStrategyOptions = [
  {
    label: "Chef de file",
    value: ClientApiDepotAuthorizationStrategyEnum.CHEF_DE_FILE,
  },
  {
    label: "Habilitation",
    value: ClientApiDepotAuthorizationStrategyEnum.HABILITATION,
  },
];

const newClientFormData = {
  nom: "",
  isModeRelax: false,
  isActive: false,
  mandataire: "",
  chefDeFile: "",
};

const ClientForm = () => {
  const router = useRouter();
  const { clientId, demo } = router.query;
  const isDemo = demo === "1";
  const [authorizationStrategy, setAuthorizationStrategy] = useState(
    authorizationStrategyOptions[0].value
  );
  const [isFormValid, setIsFormValid] = useState(false);
  const [submitError, setSubmitError] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isformChefDeFileOpen, setIsformChefDeFileOpen] =
    useState<boolean>(false);
  const [initialChefDeFileForm, setInitialChefDeFileForm] =
    useState<ChefDeFileApiDepotType>(null);
  const [chefsDeFileOptions, setChefsDeFileOptions] =
    useState<ChefDeFileApiDepotType[]>(null);
  const [mandatairesOptions, setMandatairesOptions] =
    useState<MandataireApiDepotType[]>(null);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const mandataires: MandataireApiDepotType[] =
        await getMandataires(isDemo);
      setMandatairesOptions(mandataires);
      const chefsDeFile: ChefDeFileApiDepotType[] =
        await getChefsDeFile(isDemo);
      setChefsDeFileOptions(chefsDeFile);
      if (clientId) {
        const client = await getClient(clientId, isDemo);
        setFormData({
          nom: client.nom,
          isModeRelax: Boolean(client.options?.relaxMode),
          isActive: client.active,
          mandataire: client.mandataire,
          chefDeFile: client.chefDeFile,
        });
      } else {
        setFormData(newClientFormData);
      }

      setIsLoading(false);
    }

    void fetchData();
  }, [clientId, isDemo]);

  const handleEdit = useCallback(
    (property: string) => (value: any) => {
      setFormData((state) => ({ ...state, [property]: value }));
    },
    []
  );

  const handleToggle = useCallback(
    (property: string) => () => {
      setFormData((state) => ({ ...state, [property]: !state[property] }));
    },
    []
  );

  const handleSumit = async (event) => {
    event.preventDefault();
    const { nom, isModeRelax, isActive, mandataire, chefDeFile } = formData;
    const body: any = {
      nom,
      options: { relaxMode: isModeRelax },
      active: isActive,
      mandataire: undefined,
    };
    if (
      chefDeFile &&
      authorizationStrategy ===
        ClientApiDepotAuthorizationStrategyEnum.CHEF_DE_FILE
    ) {
      body.chefDeFile = chefDeFile;
    }

    try {
      // Gestion du mandataire sélectionné ou créé
      if (typeof mandataire === "object") {
        const newMandataire = await createMandataire(mandataire, isDemo);
        body.mandataire = newMandataire._id;
      } else {
        body.mandataire = mandataire;
      }

      let _clientId = clientId;
      if (_clientId) {
        await updateClient(_clientId, body, isDemo);
      } else {
        const response = await createClient(body, isDemo);
        _clientId = response._id;
      }

      await router.push({
        pathname: "/api-depot/client",
        query: { clientId: _clientId, demo: isDemo ? 1 : 0 },
      });
    } catch (error: unknown) {
      setSubmitError((error as any).message || "");
    }
  };

  useEffect(() => {
    if (!formData) {
      return;
    }

    const { nom, mandataire, chefDeFile } = formData;

    let isFormValid = nom && mandataire;

    if (
      authorizationStrategy ===
        ClientApiDepotAuthorizationStrategyEnum.CHEF_DE_FILE &&
      !chefDeFile
    ) {
      isFormValid = false;
    }

    setIsFormValid(isFormValid);
  }, [formData, authorizationStrategy]);

  const closeFormChefDeFile = async () => {
    const chefsDeFile: ChefDeFileApiDepotType[] = await getChefsDeFile(isDemo);
    setChefsDeFileOptions(chefsDeFile);
    setInitialChefDeFileForm(null);
    setIsformChefDeFileOpen(false);
  };

  const openFormChefDeFile = (initialId: string = null) => {
    setInitialChefDeFileForm(
      chefsDeFileOptions.find((c) => c._id == initialId)
    );
    setIsformChefDeFileOpen(true);
  };

  return (
    <Loader isLoading={isLoading}>
      {formData && (
        <div className="fr-container fr-my-4w">
          <form onSubmit={handleSumit}>
            <TextInput
              label="Nom"
              value={formData.nom}
              hint="Nom du client. Exemple : Business Geografic"
              onChange={(e) => {
                handleEdit("nom")(e.target.value);
              }}
            />

            <ToggleSwitch
              label="Activé"
              helperText="Authorise le client à utiliser l’API"
              checked={formData.isActive}
              onChange={handleToggle("isActive")}
            />

            <ToggleSwitch
              label="Mode relax"
              helperText="Le mode relax assoupli les vérifications du Validateur BAL"
              checked={formData.isModeRelax}
              onChange={handleToggle("isModeRelax")}
            />

            <SelectInput
              label="Stratégie d’authorisation"
              hint="Méthode qui authorise le client à publier des BAL"
              value={authorizationStrategy}
              options={authorizationStrategyOptions}
              handleChange={(value) =>
                setAuthorizationStrategy(
                  value as ClientApiDepotAuthorizationStrategyEnum
                )
              }
            />

            <MandataireForm
              selectedMandataire={formData.mandataire}
              mandataires={mandatairesOptions}
              onSelect={handleEdit("mandataire")}
            />

            {authorizationStrategy ===
              ClientApiDepotAuthorizationStrategyEnum.CHEF_DE_FILE && (
              <>
                {isformChefDeFileOpen ? (
                  <ChefDeFileForm
                    initialChefDeFile={initialChefDeFileForm}
                    onSelect={handleEdit("chefDeFile")}
                    isDemo={isDemo}
                    close={() => closeFormChefDeFile()}
                  />
                ) : (
                  <>
                    <ChefDeFileSelect
                      selectedChefDeFile={formData.chefDeFile}
                      chefsDeFile={chefsDeFileOptions}
                      onSelect={handleEdit("chefDeFile")}
                    />
                    <div className="fr-my-4w">
                      <div className="fr-grid-row">
                        <Button onClick={(e) => openFormChefDeFile()}>
                          Créer
                        </Button>
                        <Button
                          priority="secondary"
                          onClick={(e) =>
                            openFormChefDeFile(formData.chefDeFile)
                          }
                        >
                          Modifier
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            <Button
              type="submit"
              iconId="fr-icon-save-line"
              disabled={!isFormValid}
            >
              Enregistrer
            </Button>
          </form>

          {submitError && (
            <Alert
              className="fr-mt-2w"
              severity="error"
              title="Impossible d’enregistrer"
              description={submitError}
            />
          )}
        </div>
      )}
    </Loader>
  );
};

export default ClientForm;
