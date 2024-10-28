import { useEffect, useState } from "react";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import ToggleSwitch from "@codegouvfr/react-dsfr/ToggleSwitch";

import { checkEmail } from "@/lib/util/email";

import { ChefDeFile, Perimeter } from "types/api-depot.types";
import { createChefDeFile, updateChefDeFile } from "@/lib/api-depot";
import PerimeterList from "@/components/api-depot/client/client-form/perimeter-list";

interface ChefDeFileFormProps {
  initialChefDeFile: ChefDeFile;
  isDemo: boolean;
  close: () => void;
  onSelect: (value: string) => void;
}

const ChefDeFileForm = ({
  initialChefDeFile,
  isDemo,
  close,
  onSelect,
}: ChefDeFileFormProps) => {
  const [nom, setNom] = useState<string>(
    initialChefDeFile ? initialChefDeFile.nom : ""
  );
  const [email, setEmail] = useState<string>(
    initialChefDeFile ? initialChefDeFile.email : ""
  );
  const [isEmailPublic, setIsEmailPublic] = useState<boolean>(
    initialChefDeFile ? initialChefDeFile.isEmailPublic : true
  );
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [perimeters, setPerimeters] = useState<Perimeter[]>(
    initialChefDeFile ? initialChefDeFile.perimeters : []
  );
  const [isSignataireCharte, setIsSignataireCharte] = useState<boolean>(
    initialChefDeFile ? initialChefDeFile.signataireCharte : false
  );

  const saveChefDeFile = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    try {
      const chefDeFile = {
        nom,
        email,
        isEmailPublic,
        perimetre: perimeters,
        signataireCharte: isSignataireCharte,
      };
      if (initialChefDeFile?.id) {
        await updateChefDeFile(initialChefDeFile.id, chefDeFile, isDemo);
      } else {
        const newChefDeFile: ChefDeFile = await createChefDeFile(
          chefDeFile,
          isDemo
        );
        onSelect(newChefDeFile.id);
      }
      close();
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const closePreventDefault = (event) => {
    event.preventDefault();
    close();
  };

  const handleEditNom = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setNom(value);
  };

  const handleEditEmail = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setEmail(value);
  };

  useEffect(() => {
    if (email) {
      const isValid = checkEmail(email);
      setIsEmailValid(isValid);
    } else {
      setIsEmailValid(null);
    }
  }, [email]);

  return (
    <div className="fr-my-4w">
      <form onSubmit={saveChefDeFile}>
        <label className="fr-label">Chef de file</label>

        <ToggleSwitch
          label="Signataire de la charte"
          checked={isSignataireCharte}
          helperText="Le chef de file a signé la charte"
          onChange={setIsSignataireCharte}
        />

        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-4">
            <Input
              label="Nom"
              nativeInputProps={{
                required: true,
                value: nom,
                onChange: handleEditNom,
              }}
            />
          </div>
          <div className="fr-col-4">
            <Input
              label="Email"
              nativeInputProps={{
                required: true,
                value: email,
                onChange: handleEditEmail,
              }}
              state={isEmailValid === false ? "error" : "default"}
              stateRelatedMessage="L’email n’est pas valide"
            />
          </div>
          <div className="fr-col-4">
            <ToggleSwitch
              label="Email public"
              checked={isEmailPublic}
              onChange={setIsEmailPublic}
            />
          </div>
        </div>

        <PerimeterList
          perimeters={perimeters}
          handlePerimeter={setPerimeters}
        />

        <div className="fr-my-4w fr-grid-row">
          <Button priority="primary" onClick={saveChefDeFile}>
            Enregistrer
          </Button>
          <Button priority="secondary" onClick={closePreventDefault}>
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChefDeFileForm;
