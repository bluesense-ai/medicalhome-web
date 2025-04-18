
const ContainerLoader = ({ fontSize = "1rem" }) => {
  return (
    <div className="width-full flex justify-center items-center text-center">
      <i
        className={`fa-solid fa-spinner fa-spin`}
        style={{ fontSize }}
      ></i>
    </div>
  );
};

export default ContainerLoader;