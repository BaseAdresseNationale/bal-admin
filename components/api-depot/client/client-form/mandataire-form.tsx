import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";

import { checkEmail } from "@/lib/util/email";

import SelectInput from "@/components/select-input";
import { Mandataire } from "types/api-depot.types";

interface MandataireFormProps {
  selectedMandataire: string;
  mandataires: Mandataire[];
  onSelect: (value: any) => void;
}

const MandataireForm = ({
  selectedMandataire,
  onSelect,
  mandataires = [],
}: MandataireFormProps) => {
  const [nom, setNom] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  const mandatairesOptions = useMemo(
    () =>
      mandataires.map((m) => ({
        label: m.nom + " (" + m.email + ")",
        value: m.id,
      })),
    [mandataires]
  );

  const handleCreationForm = (event, isOpen) => {
    event.preventDefault();
    setIsCreateFormOpen(isOpen);
    onSelect("");
  };

  useEffect(() => {
    if (email) {
      const isValid = checkEmail(email);
      setIsEmailValid(isValid);
    } else {
      setIsEmailValid(null);
    }
  }, [email]);

  useEffect(() => {
    if (nom && email && isEmailValid) {
      onSelect({ nom, email });
    }
  }, [nom, email, isEmailValid, onSelect]);

  return (
    <div className="fr-my-4w">
      {isCreateFormOpen ? (
        <div>
          <label className="fr-label">Mandataire</label>

          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-6">
              <Input
                label="Titre sur la page d'accueil"
                nativeInputProps={{
                  required: true,
                  value: nom,
                  onChange: (e) => setNom(e.target.value),
                }}
              />
            </div>
            <div className="fr-col-6">
              <Input
                label="Titre sur la page d'accueil"
                state={isEmailValid === false ? "error" : "default"}
                stateRelatedMessage="L’email n’est pas valide"
                nativeInputProps={{
                  required: true,
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                }}
              />
            </div>
          </div>

          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col">
              <Button
                priority="secondary"
                onClick={(e) => handleCreationForm(e, false)}
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom">
          <div className="fr-col-sm-12 fr-col-md-8">
            <SelectInput
              label="Mandataire"
              hint="Mandataire gestionnaire du client"
              value={selectedMandataire}
              defaultOption="Sélectionner un mandataire"
              options={mandatairesOptions}
              handleChange={onSelect}
            />
          </div>
          <div className="fr-col-sm-12 fr-col-md-4">
            <Button
              iconId="fr-icon-add-line"
              onClick={(e) => handleCreationForm(e, true)}
            >
              Nouveau mandataire
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MandataireForm;
