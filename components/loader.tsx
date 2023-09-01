
type LoaderProps = {
  isLoading: boolean;
  children: React.ReactNode;
}

const Loader = ({isLoading, children}: LoaderProps) => {
  if (isLoading) {
    return <div>Chargement…</div>
  }

  return children as JSX.Element
}

export default Loader
