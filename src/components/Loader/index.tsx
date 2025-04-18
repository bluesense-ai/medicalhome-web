import styles from "./loader.module.css";

interface LoaderProps {
  showOverlay?: boolean; // Optional prop with a default value
}

const Loader = ({ showOverlay = true }: LoaderProps) => {
  return (
    <div
      className={`${styles.loaderOverlay} ${!showOverlay ? styles.noOverlay : ""}`}
    >
      <div className={styles.loader}></div>
    </div>
  );
};

export default Loader;
