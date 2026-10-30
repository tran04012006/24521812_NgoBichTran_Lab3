
import styles from "./SkillBadge.module.css";

function SkillBadge({ name }) {
  return (
    <li className={styles.badge}>
      <span className={styles.label}>
        {name}
      </span>
    </li>
  );
}

export default SkillBadge;
