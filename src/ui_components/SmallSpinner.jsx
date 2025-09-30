import ClipLoader from "react-spinners/ClipLoader"

const override = {
    display: "block",
    borderColor: "purple",
}

const SmallSpinner = () => {
  return (
    <ClipLoader
      color={"#12e2ee"} // You can set a custom color
      cssOverride={override}
      size={30}
      aria-label="Loading SmallSpinner"
      data-testid="loader"
    />
  )
}

export default SmallSpinner