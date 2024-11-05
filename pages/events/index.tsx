import React from "react";
import { toast } from "react-toastify";
import Link from "next/link";

import { Button } from "@codegouvfr/react-dsfr/Button";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import { Badge } from "@codegouvfr/react-dsfr/Badge";

import { EditableList } from "../../components/editable-list";
import { getEvents, massImportEvents } from "../../lib/events";
import { Event } from "../../server/lib/events/entity";
import { EventItem } from "@/components/events/event-item";
import { createModal } from "@codegouvfr/react-dsfr/Modal";

type EventsPageProps = {
  incommingEvents: Event[];
  pastEvents: Event[];
};

const massImportEventsModale = createModal({
  id: "mass-import-events-modale",
  isOpenedByDefault: false,
});

const EventsPage = ({ incommingEvents, pastEvents }: EventsPageProps) => {
  const [massImportData, setMassImportData] = React.useState("");

  const onMassImport = async () => {
    try {
      await massImportEvents(massImportData);
      toast("Les évènements ont bien été importés", { type: "success" });
      massImportEventsModale.close();
    } catch (error: unknown) {
      toast(
        "Un problème est survenu pendant l'import, aucun évènement n'a été importé",
        { type: "error" }
      );
      console.log(error);
    }
  };

  return (
    <>
      <div className="fr-container">
        <Tabs
          className="fr-container fr-my-2w"
          tabs={[
            {
              label: (
                <>
                  <Badge style={{ marginRight: 10 }} noIcon>
                    {incommingEvents.length}
                  </Badge>{" "}
                  {`Évènement${incommingEvents.length > 1 ? "s" : ""} à venir`}
                </>
              ),
              content: (
                <EditableList
                  headers={["Type", "Nom", "Date", "Horaires", "", ""]}
                  caption="Liste des évènements"
                  data={incommingEvents}
                  filter={{
                    placeholder: "Filtrer par nom",
                    property: "name",
                  }}
                  createBtn={
                    <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--right">
                      <div className="fr-col-2">
                        <Button
                          onClick={() => massImportEventsModale.open()}
                          iconId="fr-icon-add-line"
                        >
                          Import en masse
                        </Button>
                      </div>
                      <div className="fr-col-2">
                        <Link
                          passHref
                          href={{
                            pathname: "/events/new",
                          }}
                        >
                          <Button iconId="fr-icon-add-line">
                            Créer un évènement
                          </Button>
                        </Link>
                      </div>
                    </div>
                  }
                  renderItem={EventItem}
                />
              ),
            },
            {
              label: (
                <>
                  <Badge style={{ marginRight: 10 }} noIcon>
                    {pastEvents.length}
                  </Badge>{" "}
                  {`Évènement${pastEvents.length > 1 ? "s" : ""} passés`}
                </>
              ),
              content: (
                <EditableList
                  headers={["Type", "Nom", "Date", "Horaires", ""]}
                  caption="Liste des évènements"
                  data={pastEvents}
                  filter={{
                    placeholder: "Filtrer par nom",
                    property: "name",
                  }}
                  renderItem={EventItem}
                />
              ),
            },
          ]}
        />
      </div>
      <massImportEventsModale.Component title="Import en masse">
        <p>
          Vous pouvez importer des évènements en masse en collant le contenu
          d&apos;un fichier JSON dans le champ ci-dessous.
        </p>
        <textarea
          style={{ width: "100%", height: "10rem", border: "1px solid #ccc" }}
          placeholder="Coller le contenu du fichier JSON"
          value={massImportData}
          onChange={(e) => setMassImportData(e.target.value)}
        />
        <div style={{ marginTop: "1rem" }}>
          <Button onClick={onMassImport}>Importer</Button>
          <Button
            style={{ marginLeft: "1rem" }}
            priority="tertiary"
            onClick={() => {
              massImportEventsModale.close();
            }}
          >
            Annuler
          </Button>
        </div>
      </massImportEventsModale.Component>
    </>
  );
};

export async function getServerSideProps() {
  const events = await getEvents();

  const incommingEvents =
    events
      .filter((event) => {
        return new Date(event.date) > new Date();
      })
      .sort((eventA, eventB) => {
        return (
          new Date(eventA.date).getTime() - new Date(eventB.date).getTime()
        );
      }) || [];

  const pastEvents =
    events
      .filter((event) => {
        return new Date(event.date) < new Date();
      })
      .sort((eventA, eventB) => {
        return (
          new Date(eventB.date).getTime() - new Date(eventA.date).getTime()
        );
      }) || [];

  return {
    props: {
      incommingEvents,
      pastEvents,
    },
  };
}

export default EventsPage;
