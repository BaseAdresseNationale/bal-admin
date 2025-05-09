interface SignalementTableProps {
  signalementCount: {
    pending: number;
    processed: number;
    ignored: number;
    expired: number;
  };
}

export function SignalementTable({ signalementCount }: SignalementTableProps) {
  return (
    <div className="fr-table">
      <h5>Signalements</h5>
      <br />
      <table>
        <thead>
          <tr>
            <th scope="col">En attente</th>
            <th scope="col">Traités</th>
            <th scope="col">Ignorés</th>
            <th scope="col">Expirés</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{signalementCount.pending}</td>
            <td>{signalementCount.processed}</td>
            <td>{signalementCount.ignored}</td>
            <td>{signalementCount.expired}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
