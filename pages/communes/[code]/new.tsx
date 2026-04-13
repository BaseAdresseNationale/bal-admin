import { useRouter } from "next/router";
import { toast } from "react-toastify";

import { NewBalForm } from "@/components/communes/new-bal-form";
import {
  createBaseLocale,
  populateBaseLocale,
  uploadBALFile,
} from "@/lib/api-mes-adresses";

const NewBalPage = () => {
  const router = useRouter();
  const { code } = router.query as { code: string };

  const handleCreate = async (
    nom: string,
    emails: string[],
    source: "ban" | "file",
    file: File | null,
  ) => {
    try {
      const newBal = await createBaseLocale(nom, emails, code);
      if (source === "file" && file) {
        await uploadBALFile(newBal.id, file);
      } else if (source === "ban") {
        await populateBaseLocale(newBal.id);
      }
      toast("BAL créée avec succès", { type: "success" });
      await router.push(`/communes/${code}`);
    } catch (e: unknown) {
      console.error(e);
      if (e instanceof Error) {
        toast(e.message, { type: "error" });
      }
    }
  };

  return (
    <div className="fr-container fr-my-4w">
      <h1>Nouvelle BAL</h1>
      {code && <NewBalForm codeCommune={code} onSubmit={handleCreate} />}
    </div>
  );
};

export default NewBalPage;
