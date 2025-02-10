import { useCallback, useEffect, useState } from "react";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { ToggleSwitch } from "@codegouvfr/react-dsfr/ToggleSwitch";
import { useRouter } from "next/router";

import {
  AuthorizationStrategyEnum,
  ChefDeFile,
  Client,
  Mandataire,
} from "types/api-depot.types";

import {
  createClient,
  updateClient,
  createMandataire,
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
    value: AuthorizationStrategyEnum.CHEF_DE_FILE,
  },
  {
    label: "Habilitation",
    value: AuthorizationStrategyEnum.HABILITATION,
  },
];

const newClientFormData: Partial<Client> = {
  nom: "",
  isRelaxMode: false,
  isActive: false,
  mandataireId: null,
  mandataire: null,
  chefDeFileId: null,
};

const ClientForm = () => {
  const router = useRouter();
  const clientId: string = router.query?.clientId as string;
  const isDemo: boolean = router.query?.demo === "1";
  const [authorizationStrategy, setAuthorizationStrategy] = useState(
    authorizationStrategyOptions[0].value
  );
  const [isFormValid, setIsFormValid] = useState(false);
  const [submitError, setSubmitError] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isformChefDeFileOpen, setIsformChefDeFileOpen] =
    useState<boolean>(false);
  const [initialChefDeFileForm, setInitialChefDeFileForm] =
    useState<ChefDeFile>(null);
  const [chefsDeFileOptions, setChefsDeFileOptions] =
    useState<ChefDeFile[]>(null);
  const [mandatairesOptions, setMandatairesOptions] =
    useState<Mandataire[]>(null);
  const [formData, setFormData] = useState<Partial<Client>>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const mandataires: Mandataire[] = await getMandataires(isDemo);
      setMandatairesOptions(mandataires);
      const chefsDeFile: ChefDeFile[] = await getChefsDeFile(isDemo);
      setChefsDeFileOptions(chefsDeFile);
      if (clientId) {
        const client: Client = await getClient(clientId, isDemo);
        setAuthorizationStrategy(client.authorizationStrategy);
        setFormData({
          nom: client.nom,
          isRelaxMode: client.isRelaxMode,
          isActive: client.isActive,
          mandataireId: client.mandataireId,
          chefDeFileId: client.chefDeFileId,
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
    const {
      nom,
      isRelaxMode,
      isActive,
      mandataireId,
      mandataire,
      chefDeFileId,
    } = formData;
    const body: Partial<Client> = {
      nom,
      isRelaxMode,
      isActive,
      authorizationStrategy,
    };

    if (
      authorizationStrategy === AuthorizationStrategyEnum.CHEF_DE_FILE &&
      chefDeFileId
    ) {
      body.chefDeFileId = chefDeFileId;
    }

    try {
      if (mandataireId) {
        body.mandataireId = mandataireId;
      } else if (mandataire) {
        const newMandataire: Mandataire = await createMandataire(
          mandataire,
          isDemo
        );
        body.mandataireId = newMandataire.id;
      }

      if (clientId) {
        await updateClient(clientId, body, isDemo);
        await router.push({
          pathname: "/api-depot/client",
          query: { clientId, demo: isDemo ? 1 : 0 },
        });
      } else {
        const response = await createClient(body, isDemo);
        await router.push({
          pathname: "/api-depot/client",
          query: { clientId: response.id, demo: isDemo ? 1 : 0 },
        });
      }
    } catch (error: unknown) {
      setSubmitError((error as any).message || "");
    }
  };

  useEffect(() => {
    if (!formData) {
      return;
    }

    const { nom, mandataireId, mandataire, chefDeFileId } = formData;

    let isFormValid: any = nom && (mandataireId || mandataire);

    if (
      authorizationStrategy === AuthorizationStrategyEnum.CHEF_DE_FILE &&
      !chefDeFileId
    ) {
      isFormValid = false;
    }

    setIsFormValid(isFormValid);
  }, [formData, authorizationStrategy]);

  const closeFormChefDeFile = async () => {
    const chefsDeFile: ChefDeFile[] = await getChefsDeFile(isDemo);
    setChefsDeFileOptions(chefsDeFile);
    setInitialChefDeFileForm(null);
    setIsformChefDeFileOpen(false);
  };

  const openFormChefDeFile = (initialId: string = null) => {
    setInitialChefDeFileForm(chefsDeFileOptions.find((c) => c.id == initialId));
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
              checked={formData.isRelaxMode}
              onChange={handleToggle("isRelaxMode")}
            />

            <SelectInput
              label="Stratégie d’authorisation"
              hint="Méthode qui authorise le client à publier des BAL"
              value={authorizationStrategy}
              options={authorizationStrategyOptions}
              handleChange={(value) =>
                setAuthorizationStrategy(value as AuthorizationStrategyEnum)
              }
            />

            <MandataireForm
              selectedMandataire={formData.mandataireId}
              mandataires={mandatairesOptions}
              onSelect={handleEdit("mandataireId")}
              onCreate={handleEdit("mandataire")}
            />

            {authorizationStrategy ===
              AuthorizationStrategyEnum.CHEF_DE_FILE && (
              <>
                {isformChefDeFileOpen ? (
                  <ChefDeFileForm
                    initialChefDeFile={initialChefDeFileForm}
                    onSelect={handleEdit("chefDeFileId")}
                    isDemo={isDemo}
                    close={() => closeFormChefDeFile()}
                  />
                ) : (
                  <>
                    <ChefDeFileSelect
                      selectedChefDeFile={formData.chefDeFileId}
                      chefsDeFile={chefsDeFileOptions}
                      onSelect={handleEdit("chefDeFileId")}
                    />
                    <div className="fr-my-4w">
                      <div className="fr-grid-row">
                        <Button onClick={(e) => openFormChefDeFile()}>
                          Créer
                        </Button>
                        <Button
                          priority="secondary"
                          onClick={(e) =>
                            openFormChefDeFile(formData.chefDeFileId)
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
