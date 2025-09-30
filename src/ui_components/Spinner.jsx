import PacmanLoader from "react-spinners/PacmanLoader"

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "purple",
}

const Spinner = () => {
  return (
    <PacmanLoader
      color={"#12e2ee"} // You can set a custom color
      cssOverride={override}
      size={75}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  )
}

export default Spinner